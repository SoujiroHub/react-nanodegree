Udacicards Project Solution
===========================

This is my final assessment project for Udacity's React Native course

Run the project
---------------

The `.zip` file not have the `node_modules` folder. So, to run the project please execute:

    yarn install
    yarn start

> Note: Required package: `wathcman`

# Component

- `<Decks>`, Main screen. List all the decks in the storage
- `<Deck>`, Represent one deck of the storage
- `<NewDeck>`, Form that allow add a new deck
- `<Cards>`, Represent the cards of a deck
- `<Card>`, Represent a card itsel
- `<NewCard>`, Form that allow add a new card to a deck
- `<Answer>`, Subcomponent to show the card's answer.
- `<Question>`, Subcomponent to show card's question.
- `<TextButton>`, Component to represent the button with text
- `<CardStatusBard>`, Component to customize the status bar

# Redux
Folder with the actions and reducers for the entities in the storafe
