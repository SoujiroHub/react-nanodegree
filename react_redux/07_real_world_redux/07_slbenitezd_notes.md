Real World Redux
================

Up until this pont we have covered all the features of redux by building out a simple todo/goals app. This project was great for learning purposes but it's somewhat rudimentary and isn't represent the complexities of a real-world porject. So let's use:

- React
- Redux
- React Redux bindings
- Redux middleware

To build a complex real world application. The goal is build a [redux-twitter](https://tylermcginnis.com/projects/redux-twitter/) with this particular features:

- Write a new tweet
- Reply a tweet
- Give like to a tweet
- Persist all the tweets interactions

All the development will be in the `/reactnd_chirper_app_master` folder.

Project Walkthrough
-------------------

To help you solidify your understanding of React and Redux, we will do a project walkthrough. The project we'll be building is called “Chirper”. Building this simple Twitter clone will help you practice improving the predictability of an application's state; establishing strict rules for getting, listening, and updating the store; and identifying what state should live inside of Redux and what state should live inside of React components.

As with most things, there is more than one correct way to achieve a successful result. We will be discussing one approach to building a React/Redux project. We encourage you to come up with an approach that works for you. Regardless of the approach you choose, make sure always to plan out your project's architecture _before_ starting to code.

### The Importance of Planning Your Project

Many developers make the mistake of starting to code before they've put any thought into figuring out precisely what their app's architecture should be. This approach results in spending an incredible amount of time debugging, restructuring the code, and sometimes even starting over, completely!

Trust us, planning out your project before starting to code will save you a lot of time later on.

In our Chirper project walkthrough, we'll go over the planning stages as well as the coding stages of the project.

### Planning YOur React/Redux App's Architecture

In the Planning Stage, we will go over 4 steps that will help you come up with your app's architecture, which is often the trickiest part.

1. Identify what each view should look like
2. Break each view into a hierarchy of components
3. Determine what events happen in the app
4. Determine what data lives in the store

### Coding in Stages
We'll be building the project along together, breaking down each phase of the project's development. The first thing we we'll do is take a look at the different views the final project should have.

Let's dive in!


Step 1: Indetify Each View
--------------------------

We need to determine the look and functionality of each view in your app. One of the best approaches is to draw each view of the app on paper so that yout will have a good idea of what information and data you are plannig to have on each page.

> Instead of paper and pencil you can use [software for creating mockups](https://codingsans.com/blog/mockup-tools)

### View for the Dashboard Page
#### Dashboard View Requirements
- Is located at home route (`/`)
- Shows tweets sorted from most recently added at the top, to oldest at the bottom
- Each tweet will show:
    - The author
    - The timestamp
    - Who the author is replying to
    - The text of the tweet
    - A reply button –with the number of replies–
    - A like button –with the number of likes–

### View for the Tweet Page
#### Tweet Page View Requirement
- Is located ad `/tweet/:id`
- Shows an individual tweet
    - The author
    - The timestamp
    - A reply button –with the number of replies–
    - A like button –with the number of likes–
- Has a reply form
- Shows all replies

### View for the Creating a New Tweet
#### Tweet Page View Requirement
- Is located at `/new`
- Has a textbox for adding a new tweet

### View Recap
So these are the 3 view in our app:
- Dashboard
- Tweet
- New Tweet

We now have a clear idea of what we're trying to build and can be confident that our views meet all of the provided requirements

Step 2: Break Each View Into Hierarchy of Components
----------------------------------------------------
Let's do two things:

- Draw boxes around every component
- Arrange our components into a hierarchy

> To determine if something should be a component you should follow the **Single Responsibility Principle**

### Components for the Dashboard View
- **App** - The overall container for the project
- **Navigation** - Displays the navigation
- **Tweets List** - Responsible for the entire list of tweets
- **Tweet** - In charge of display the content for a single tweet

### Components for the Tweet View
- **App** - The overall container for the project
- **Navigation** - Displays the navigation
- **Tweets Container** - Displays a list of tweets
- **Tweet** - Displays the content for a single tweet
- **New Tweet** - Displays the form to create a new tweet (reply)

### Components for the New Tweet View
- **App** - The overall container for the project
- **Navigation** - Displays the navigation
- **New Tweet** - Displays the form to create a new tweet (reply)

### All Components
So from the way I broke things down, the application will have the following compoenents:

- App
- Navigation
- Tweet List
- Tweet Container
- Tweet
- New Tweet

This component hierarchy tell us which components will be used inside of the other components. It gives us the skeleton of our app. All of these are presentational components. Rigth now, we don't care which components will be upgraded to containers. As we start building out the store, we will create additional components that will be container components to get data from the store and pass it to the presentational components that need the data.

Thus far, we haven't done anything that is special to Redux; all of the steps above are applicable and useful for React applications that not use Redux.

Remember that Redux doesn't care about _how_ our app looks or what components it uses. Instead, it gives a way to manage the _state_ of the application in a predictable way. When we talk about _state_, we are really talking about _data_ –not just any kind of data inside the app, but data that can change base on the events in the app–

Step 3: Determine the Events in the App
---------------------------------------

We need to take a look to _what_ is happening in each component. Let's determine what actions the app or the user is perfoming **on the data**. It is the data being set, modified or deleted?. Then we will need an action to keep track of that event!

Let's _bold_ the action and **underline** the data.


### Tweets List Component
For the Tweets List component, the only information that we see is that we'll have to get a list of all of the tweets. So for this component, we just need to:

- _Get_ the **tweets**

So the action type for event this will probably `GET_LIST_OF_TWEETS`

### Tweet Component

- We _get_ a particular tweet from a list of **tweets**
- We _get_ the **authedUser (user that is currently logged in)** so the user can _toggle_ the likes on each **tweets*
- We _get_ the **authedUser** so the user can _reply_ to a **tweet**

### Tweet Container Component

- We _get_ a specific tweet from a list of **tweets**
- We _get_ the replies to a specific tweet from a list of **tweets**

### New Tweet Component

- We _get_ the **authedUser**, so the user can _create_ a new **tweet**
- We _set_ the **text of the new tweet**

Step 4: Data and the Store
--------------------------

Remember that the main problems that Redux (and react-redux bindings!) was meant to solve were:

- Propagation of props through the entire component tree
- Ensuring consistency and predictability of the state across the app

According to Dan Abramov, the creator of Redux, we should follow the following principle for determining whether to store a piece of data in the store or in React component:

> Use Redux for the state that matters globally or is mutated in complex ways... The rule of thumb is: _do whatever is less awkward_

For each piece of data from Step 3, let's see whether it's used by multiple components or mutated in a complex way.

### _Text of the new tweet used by:_ New Tweet Component

This piece of data is not used by multiple components and is not mutated in a complex way. That means that it is a great candidate for components state instead of app state that resides in the store.

### _Tweets used by:_ Dashboard Component, Tweet Page Component and Tweet Component

In the Tweet Page Component, we need to show the reply tweets. Let's take a look at the starter code in `_Data.js`:

```js
let tweets = {
    tweetId: {
        id: tweetId,
        text: tweetText,
        author: userId,
        timestamp: timestamp,
        likes: [userId1, userId2],
        replies: [tweetId1, tweetId2],
        replyingTo: tweetId_OR_null
    }
};

```

To get reply tweets, we can get the tweet with a specific id from the list of all of the tweets and access its `replies` properties.

In the **Dashboard Component** we need to access the current list of tweets. If the Dashboard component knows the ID of the tweet that needs to be displayed, it can just pass an ID to the Tweet Component, which will render the tweet.

In the **Tweet Component**, we need to pick out a tweet with a specific ID from the current list of tweets.

That means that we can store the tweets in the store and make the Dashboard Component, Tweet Page Component, Tweet Component into containers –components that have access to the store via the `connect()` function–

As soon as the data changes (e.g. someone likes the tweet), all the components that use the data will update.

Keep in mind that each tweet contains the author's name and the author's avatar. One way we can model the state is:

```js
tweets: {
    tweetId: {tweetId, authorId, authorName, authorAvatar, timestamp, text, likes, replies, replyingTo},
    tweetId: {tweetId, authorId, authorName, authorAvatar, timestamp, text, likes, replies, replyingTo}
}
```

Modeling the state this way is not wrong, but is inconvenient if we want to extend the functionality of the app in the future to be able to find tweets made by a particular author. Moreover, this way of storing the data mixes the two types of objects:

- tweets data
- user data

This goes against the recommendation to normalize the states. According to the Redux documentations, here are the principles of state normalizations:

- Each type of data gets its own "table" in the state,
- Each "data table" should store the individual items in an object, with the IDs of the items as keys and the items themselves as the values.
- Any references to individual items should be done by storing the item's ID.
- Arrays of ISs should be used to indicate order.

Then, normalized state of the app would look like this:

```js
{
    tweets: {
        tweetId: { tweetId, authorId, timestamp, text, likes, replies, replyingTo},
        tweetId: { tweetId, authorId, timestamp, text, likes, replies, replyingTo}
    },
    users: {
        userId: {userId, userName, avatar, tweetsArray},
        userId: {userId, userName, avatar, tweetsArray}
    }
}
```

### _authedUser used by:_ Tweet Component and New Tweet Component

Each Tweet Component needs to show whether the logged in user has liked a tweet. To do that, we need to know who the logged in user is. Looking at the Component Hierarchy from Step 2, we know that the Tweet Component gets used by multiple components. Therefore, we need to upgrade this component to a container so it could access the `authedUser` piece of data from the store to see whether to show a red heart.

We also know that for every new tweet, we will have to record who the tweet's author is. The React way of storing state is to put the state in the most parent component and the pass it down to all the children that need it. In this app, that would mean storing in the App Component.

One way to do that is to store the `authedUser` in the App Component and the pass it down to the components that need access to it. While this works, it is inconvenient. It would be simpler to store the `authedUser` in the store and the provide the Tweet Component access to the store. The New Tweet Component could then just dispatch an action with the text of the new tweet and the id of the tweet we are replying to as parameters in order to save the new tweet.

Saving a tweet is an asynchronous operation we could use redux thunks to do that. Thunks give us access to the store so we could have the following action creator:

```js
function handleAddTweet(text, replyingTo) {
    return (dispatch, getState) => {
        const { authedUser } = getState();

        return saveTweetToDatabase({
            text,
            author: authedUser,
            replyingTo
        }).then(tweet => dispatch(addTweet(tweet)));
    };
}
```

Generally, accessing the store from an action creator is considered an anti-pattern. Dan Abramov says that the few use cases where it is acceptable to do that are:

> To check data before you make a request or to check whether you are authenticated (i.e. doing a conditional dispatch)

Another reason we would want to keep the `authedUser` piece of data in the store is that if we extend our application to include the ability to sign in and sign out, this functionality would be easy to manage with Redux.

The New Tweet Component doesn't need to access the `authedUser` piece of state, but it _does_ need to be able to dispatch an action to let the reducer know that a new tweet has been made. To have access to the `dispatch()` method. a component must be connected to the store. In other words, it must be a container. So, we know that the Tweet Component and the New Tweet Component will be upgraded to containers. Finally, we get:

| **The Store** |
|:-------------:|
|     Tweets    |
|     Users     |
|   authedUser  |

Our store is done! While we making our store, we also determined which components will be upgraded to containers, so our skeleton app is now even more complete. Time to start coding.

Actions
-------

Let's start with the Dashboard View that displays a list of tweets and a menu.

We need to take a look at _what_ is happening in this view. Let´s determine what actions the app or the user is performing **on the data** – is the data being set, modified, or deleted? –

When the app loads, the Dashboard View is displayed. The Dashboard Component therefore needs to:

- _get_ the **tweets**
- _get_ the **users**
- _get_ the **autedUsers**

This data is stores in a database. For this view to load all of the tweets –including their author's avatars– we need:

1. Get the `tweets` and `users` data from the database
2. Then, pass that data into the component

For best practices in React apps, you should make the API request in the `componentDidMount()` lifecycle method and for React/Redux apps you should make the API requests from asynchronous action creators.

The Action Creators returns actions (i.e. simple Javascript objects that then go to all of our reducers). Making an API request is an asynchronous action, so we cannot just send a plain Javascript object to our reducers. Redux middleware can gain access to an action when it is on its way to the reducers. We will be using `redux-thunk` middleware in this example.

If the Redux Thunk middleware is enable –which is done vie the `applyMiddleware()` function–, then any time your action creator returns a function instead of a Javascript object,it will go to the react-thunk middleware.

Dan Abramov describes what happens next:

> "The middleware will call that function with dispatch method itself as the first argument. The action will only reach the reducers once the API request is completed. It will also _swallow_ such actions so dosn't worry about your reducers receiving weird function arguments. Your reducers will only receive plain object action, either emmited directly, or emitted by the functions as we just described"

Here is what a thunk action creator looks like:

```js
function handleInitialData () {
    return function (dispatch) {}
}
```

Which is equvalent to this in ES&:

```js
function handleInitialData () {
    return (dispatch) => {}
}
```

Now, we need to give our components access to the data that came in. This means, we need to populate the store with `tweets` and `users`

| **The Store**                                                                       |
|-------------------------------------------------------------------------------------|
| **Tweets:** The results of a tweets action going via its tweets reducer             |
| **Users:** The results of a users action going via its users reducer                |
| **authedUser:** The results of a authedUser action going via its authedUser reducer |

Reducers
--------

A Reducer describes _how_ application's state chagnes. You will often see the Object Spread Operator (`...`) used inside of a reducer because a reducer **must return a new object** instead of mutating the old state. Reducers have the following signature:

```js
(previousState, action) => newState
```

The last table illustrates how the app will modified the state.

### Initializing State
There are 2 ways to initialize the state inside the store:

- You can pass the initial state (or part of the initial state) as `preloadedState()` to the `createStore()` function. For example:

```js
const store = createStore (
    rootReducer,
    { tweets: {} }
)
```

- You can include a default state parameter as the first argument inside a particular reducer function. For example:

```js
function tweets (state = {}, aciton) {
    // reducer body
}
```

In the app, we initialized each slice of the store by setting a default `state` value as the first paramete inside each reducer function (option two). So, The **tweets** slice of the state in the store has been initialized to an empty object. The **users** slice of the state in the store has been initialized to an empty object. And, the **authedUser** slice of the state in the store has been initialized to null.

Therefore, we have a `tweets` reducer to manage the _tweets_ slice of the state, a `users` reducer to manage the _users_ slice of the state, and an `authedUser` reducer to manage the _authedUser_ portion of the state. Each of these reducers will manage just its own part of the state. We will combine all of these reducers into one main, root reducer, which will combine the results of calling the `tweets` reducer, `users` reducer, and `authedUser` reducer into a single state object. Remember, we need to do this because the `createStore()` function only accepts a single reducer.

```js
combineReducers({
    authedUser: authedUser,
    tweets: tweets,
    users: users
})
```

Or using ES6's property shorthand, it can just be:

```js
combineReducers({
    authedUser,
    tweets,
    users
})
```

Now that all of our reducers are set up, we need to actually create the store and provide it to our application. To actually use any of the code that we've written up to this point, we need to install the `redux` package. Then, to provide the store to our application, we'll also need to install the `react-redux` package.

Redux applications have a single store. We have to pass the Root Reducer to our `createStore()` function in order for the store to know what pieces of state it should have. The point of creating a store is to allow components to be able to access it without having to pass the data down through multiple components.

The `Provider` component (which comes from the react-redux package) makes it possible for all components to access the store via the `connect()` function.

### Middleware

The last setup involves setting up the app's Middleware functions. Let's create a _logger_ middleware that will help us view the action and state of the sotre as we interact with our application. Also, since `handleInitialData()` action creator in `share.js` returns a function we'll need to install the `react-thunk` package.

Let's hook up our `redux-thunk` middleware, so our thunk action creators actually work. We will put in logger middleware to make debugging easier. All middleware follows this currying pattern:

```js
const logger = (store) => (next) => (action) => {
    // ...
}
```

The variable `logger` is assigned to a function that takes the `store` as its argument. That function returns another function, which is passed `next` (which is the next middleware in line or the dispatch function). That other function return another function which is passed an `action`. Once inside that third function, we have access to `store`, `next`, and `action`.

It's important to note that the value of the next parameter will be determined by `applyMiddleware()` function. All middleware will be called in the order it is listed in that function. In our case, the `next` will be `dispatch` because `logger` is the last middleware listed in that function. Here is the middleware wiring:

```js
export default applyMiddleware(
    thunk,
    logger
);
```

Each thing retruned by an action creator – be it an action or a function – will go through the thunk middleware. The next snippet is the source code of the `thunk` middleware:

```js
function createThunkMiddleware(extraArgument) {
    return ({ dispatch, getState }) => next => action => {
        if (typeof action === 'function') {
            return action(dispatch, getState, extraArgument);
        }
        return next(action);
    };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
```

If the thunk middleware sees an _action_, that action will be sent to the next middleware in line – the logger middleware –. If it sees a _function_, the `thunk` middleware will call that function. That function can contain side effects – such as API calls – and dispatch actions, simple Javascript objects. These dispatched actions will again go to all of the middleware. The thunk middleware will see that it’s a simple action and pass the action on to the next middleware, the logger.

Once inside the logger:

```js
const logger = store => next => action => {
    console.group(action.type);
        console.log("The action:", action);
        const returnValue = next(action);
        console.log("The new state:", store.getState());
    console.groupEnd();

return returnValue;
};
```

So, the order in which your pass your arguments inside the `applyMiddleware()` function matters.

Initializing the App's Data
---------------------------

We have previously determined that we need to get the `users` and `tweets` data from our database and send that data to our store, along with the `authedUser` data, when the home page loads.

We have also created a thunk action creator that gets the data from the database and then dispatches action to the store to set the three pieces of state we have in our store:

- `users`
- `tweets`
- `authedUser`

Here's what the `handleInitialData()` thunk action creator looks like:

```js
function handleInitialData () {
    return (dispatch) => {
        return getInitialData()
        .then(({ users, tweets }) => {
            dispatch(receiveUsers(users));
            dispatch(receiveTweets(tweets));
            dispatch(setAuthedUser(AUTHED_ID));
        });
    };
}
```

Now the question is _where_ do we dispatch this action creator?. When we walked through the architecture of the app, we saw that the _App_ Component will contain every othe component. If we load the initial data from the _App_ Component, then no matter which route our users goes to, they will se all of the correct data. So, the answer is the App Component.

Using the `connect()` function upgrades a component to a container. Containers can read state from the store and dispatch actions.

Dashboard Component
-------------------

In the application, normalized state would look like this:

```js
{
    tweets: {
        tweetId: { tweet id, author’s id, timestamp, text, likes, replies, replyingTo},
        tweetId: { tweet id, author’s id, timestamp, text, likes, replies, replyingTo}
    },
    users: {
        userId: {user’s id, user’s name, avatar, tweets array},
        userId: {user’s id, user’s name, avatar, tweets array}
    }
}
```

In the Planning Stage, we also determined that the Dashboard Component will be a container since it will need access to the `tweets` part of the store in order to display the list of tweets.

To make a container, we need to make use the `connect()` function. Remember the signature of the connect function looks like this:

```js
connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])
```

These details about `mapStateToProps` and `mapDispatchToProps` are crucial:

- **`mapStateToProps`**: If this argument is specified, the new component will subscribe to Redux store updates. This means that any time the store is updated, `mapStateToProps` will be called. the results of `mapStateToProps` must be a plain object. which will be merfed into the component's props. if you don't want to subscribe to store updates, pass `null` or `undefined` in place of `mapStateToProps`.

- **`mapDispatchToProps`**: If an object is passed, each function inside it is assumed to be Redux action creator. An object with the same function names, but with every action creator wrapped into a dispatch call so they may be invoked directly, will be merged into the component's props. If a function is passed, it will be given dispatch as the firts parameter. It's up to you, to return an object that soemhow uses dispatch to bind action creators in your own way,

Now, in the Component Hierarchy we define that the Tweet Component will be inside of the Dashboard Component. If the Dashboard Component knows the ID of the tweet that needs to be displayed, it can just pass that ID to the Tweet Component, which will render the tweet.

The signature of the `mapStateToProps` function is;

```js
mapStateToProps(state, [ownProps])
```

- `state` is the state inside the stoer
- `ownProps` are the properties that heve been passed to this component from a parent component

Since we only care about the `tweets` part of the store, we can use destructuring to pass the `tweets` part of the state in the sotre as the parameter to the `mapStateToProps()` function.

```js
function mapStateToProps( {tweets} ){
    return { tweetIds: Object.keys(tweets) };
}
```

The important things to note are that:
- **tweets** is the slice of the state that this component cares about
- **tweetIds** will show up as a property on this container.

Tweet Component
---------------

According our step 4, the Tweet Component will need access to the following data:

- `users`
- `tweets`
- `authedUser``

So the Tweet Component will be a container. An important detail is that in the `<Dashboard />` we have to pass the `id` prop along to the Tweet Component: `<Tweet id={id}/>` also the `mapStateToProps` function of the Tweet Component will recieve as second argument (`ownProps`) and object that has an `id` property with this value. The `mapStateToProps` function looks like:

```js
function mapStateToProps ({authedUser, users, tweets}, { id }) {
    const tweet = tweets[id];

    return {
        authedUser,
        tweet: formatTweet(tweet, users[tweet.author], authedUser)
    };
}
```

Notice that `mapStateProps` accepts two arguments:

- the state of the store
- the props passed to the Tweet Component

We are desetructuring both arguments. From the store, we are extracting:

- the `authedUser` data
- the `users` data
- the `tweets` data

Then we are getting the `id` from the props passed to the Tweet Component. We need both of these piece of data – coming from the store's state and coming from the props component – so that we can determine which Tweet should be displayed by the Tweet Component.

The last detail that we have to handle in the `mapStateProps` function of the Tweet Component is related to the reply tweet feature. To handle this scenario we have to add a validation to identify the parent tweet. So the `mapStateProps` function now looks like:

```js
function mapStateToProps ({authedUser, users, tweets}, { id }) {
    const tweet = tweets[id];
    const parentTweet = tweet ? tweets[tweet.replyingTo] : null;

    return {
        authedUser,
        tweet: tweet
        ? formatTweet(tweet, users[tweet.author], authedUser, parentTweet)
        : null
    };
}
```

Now, we are getting all the data that we need from the store. Time to build the UI of the Tweet Component.

### `react-redux-loading`
This library is a set of a component, a reducer and their repectives actions creators that allow us to show a loading bar while the app retrieve all the data.

Liking a Tweet
--------------
In the Planning Stage, we figured out that we needed to give the Tweet Component access to the `authedUser` data for the tweet to correctly show whether the logged in user liked the tweet or not and for the user to reply tweets. Also, once the user likes or un-likes a tweet, that informatio needs to be reflected in the store for other components show the correct data.

We will need to write an asynchronous action creator since we need to record whether the logged in user liked a tweet not only in the sotre but also in the database. _Redux thunks_ to the rescue!.

So we can create a thunk action creator like:

```js
function handleToggleTweet (info) {
    return (dispatch) => {
        saveLikeToggle(info)
            .then(() => {
                dispatch(toggleTweet(info));
            })
            .catch((e) => {
                console.warn('Error in handleToggleTweet: ', e);
                alert('There was an error liking the tweet. Try again.');
            });
    };
}
```

The code only upsated the UI once we receive confirmation that the backend update was successful. This can make the app seem laggy. A common approach to UI updates is Optimistic Updating: updating the UI _before_ the action gets recorded on the backend so it seems more performant.

### Like Tweet Reducer
Remember that the `tweets` reducer will determine how the `tweets` part of the state changes. When linking/unlinking a tweet, the state for that specific tweet need to change – either the tweet's `like` property – will need to changes to include the user that clicked it, if they are linking to the tweet, or the user's name will need to be removed from the `like` property of the tweet that is an array of authors.

