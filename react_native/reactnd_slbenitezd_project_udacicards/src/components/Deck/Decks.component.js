import React, { Component } from 'react'
import { FlatList, TouchableHighlight, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { AppLoading} from 'expo'
import styled from 'styled-components'

import { getDecks } from '../../utils/api'
import { receiveDecks } from '../../redux/actions/decks.action'
import { ORANGE_WHITE, MONTECARLO, MANATEE } from '../../utils/colors'

const Wrapper = styled.View`
  background: ${ORANGE_WHITE};
  flex: 1;
`

const DeckList = styled.FlatList`
  flex: 1;
`

const DeckItem = styled.View`
  align-items: center;
  flex: 1;
  min-height: 120px;
  padding: 40px 20px 20px 20px;
`

const DeckTouchable = styled.TouchableHighlight`
  border: solid 2px ${MONTECARLO};
`

const TextTitle = styled.Text`
  background-color: transparent;
  color: ${MONTECARLO};
  font-size: 34px;
  text-align: center;
`

const TextCardsQuantity = styled.Text`
  background-color: transparent;
  color: ${MANATEE};
  font-size: 18px;
  text-align: center;
`

class Decks extends Component {
  state = {
    showInput: false
  }

  keyExtractor = ( item ) => item

  componentDidMount () {
    const { dispatch } = this.props

    getDecks()
      .then((decks) => dispatch(receiveDecks(decks)))
  }

  renderItem = ({item}) => {
    const { decks } = this.props
    const { title, questions } = decks[item];

    return (
      <DeckTouchable onPress={() => {
        this.props.navigation.navigate(
          'Deck',
          {
            decks: decks,
            deckItem: item,
            title: title,
            questions: questions,
          }
        )
      }}>
        <DeckItem>
          <TextTitle>{title}</TextTitle>
          <TextCardsQuantity>{questions.length} Cards</TextCardsQuantity>
        </DeckItem>
      </DeckTouchable>
    )
  }

  render() {
    const { decks } = this.props

    if (decks === null) {
      return <AppLoading />
    }

    if (Object.keys(decks).length === 0) {
      return (
        <Wrapper>
          <TextTitle>Add some decks to get started!</TextTitle>
        </Wrapper>
      )
    }

    return (
      <Wrapper>
        <DeckList
          data={Object.keys(decks)}
          keyExtractor={this.keyExtractor}
          extraData={this.state}
          renderItem={this.renderItem}
        />
      </Wrapper>
    )
  }
}

function mapStateToProps ({ decks }) {
  return { decks }
}

export default connect(mapStateToProps)(Decks)