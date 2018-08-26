import React, { Component } from 'react'
import { FlatList, TouchableHighlight, Text, View } from 'react-native'
import { connect } from 'react-redux'
import { AppLoading} from 'expo'

import { getDecks } from '../../utils/api'
import { receiveDecks } from '../../redux/actions/decks.action'

class DeckList extends Component {
  state = {
    showInput: false
  }

  componentWillMount () {
    const { dispatch } = this.props

    getDecks()
      .then((decks) => dispatch(receiveDecks(decks)))
  }

  renderItem = ({item}) => {
    const { title, questions } = this.props.decks[item];

    return (
      <TouchableHighlight onPress={() => {
        alert('hola')
      } }>
        <View>
          <Text>{title}</Text>
          <Text>{questions.length} cards</Text>
        </View>
      </TouchableHighlight>
    )
  }

  render() {
    const { decks } = this.props

    if (decks === null) {
      return <AppLoading />
    }

    const keys = Object.keys(decks)

    if (keys.length === 0) {
      return (
        <View style={{paddingTop: 50}}>
          <Text>Add some decks to get started!</Text>
        </View>
      )
    }

    return (
      <View>
        <FlatList
          data={Object.keys(decks)}
          extraData={this.state}
          renderItem={this.renderItem}
          containerStyle={{borderBottomWidth: 2}}
        />
      </View>
    )
  }

}

function mapStateToProps ({ decks }) {
  return { decks }
}

export default connect(mapStateToProps)(DeckList)