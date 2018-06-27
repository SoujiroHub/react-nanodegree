React-Redux
===========

Intro
-----

At this point, it is clear that Resux is not coupled to React at all. You can build a fully-fledged app using Redux at any Vue library. Howevere, Redux was built with React in mind, and there are some steps we can take in our app to make the experience between the two technologies a littel more seamless.

Connect & Provider
------------------

As you seen, Redux doesn't have any relation to React. React is another UI library that can leverage Redux for more predictable state management. Looking at our own implementation of React and Redux together, the real _key is that we are passing down our store as a prop and utilizing it to get the state `dispatch()` or `subscribe()` whenever we need to._ The whole goal of our abstraction should be making the store's three responsabilities work as seamlessly with react as possible.

### Getting the Store to Each Component
The first thing we want to do is improve _how each component gets access to the store_. If it's tough for a component to access the store, whether it's to get the state, listen to the state, or update the state, nothing else we do will matter. Right now we’re just passing the store down as a prop. It works fine enough in our small app, but what if we had a larger app with more layers to it? Passing the store down ten components deep wouldn't scale very well. One of the main points of having a store is to avoid passing props down through a bunch of components.

One reason React –talking about React for a moment, not Redux– is so popular is because it's very efficient. It's efficient in keeping state localized to a component, it's efficient in keeping UI confined to a component, and it's efficient in knowing when something has changed and re-rendering just that component. So the second thing we need need to figure out is how to re-render components only if the data they depend on (from the store) changes. Right now, we're solving this by calling `getState()` at the root of our application and then passing the data down. Again, this won't scale well as our app grows.

If we can find a nice abstraction for getting the store to any component that needs it and only re-rendering components when the exact data they need change, we'll improve every aspect of our current codebase.

Fourtunately, after React v16.3 we can use the [React Context API](https://reactjs.org/docs/context.html). Context provides a way to pass data through the component tree without having to pass props down manually at every level.

In a typical React application, data is passed top-down (parent to child) via props, but this can be cumbersome for certain types of props (e.g. locale preference, UI theme) that are required by many components within an application. Context provides a way to share values like these between components without having to explicitly pass a prop through every level of the tree.

### Context
Before we add the `Context` API into our app, let's make sure we're on the same page as to how it all works.

Recall that in the first React approaches we had to pass data from component to component:

```js
import React from 'react';
import { render } from 'react-dom';

function Parent ({ name }) {
    return (
        <div>
            <h1>Parent</h1>
            <Child name={name}/>
        </div>
    );
}

function Child ({ name }) {
    return (
        <div>
            <h1>Child</h1>
            <Grandchild name={name}/>
        </div>
    );
}

function Grandchild ({ name }) {
    return (
        <div>
            <h1>Grandchild</h1>
            <h3>Name: {name}</h3>
        </div>
    );
}

class App extends React.Component {
    render() {
        const name = 'Tyler';

        return (
            <Parent />
        );
    }
}

render(<App />, document.getElementById('root'));
```
> The `name` variable is passing from `<App />` to `<Grandchild />` through `<Parent />` and `<Child />`. However,`<Parent />` and `<Child />` never uses the `name` property

This process of "threading props" to send data to a child component can be tiresome, and perhaps even error-prone. Luckily, we can avoid it with React's `Context` API. To begin, we'll use React's `createContext()` function to return an object with a `Provider` as well as a `Consumer`. the next snippet is the last code usign the `Context` API.

```js
import React from 'react';
import { render } from 'react-dom';

const Context = React.createContext();

function Parent () [
    return (
        <div>
            <h1>Parent</h1>
            <Child />
        </div>
    )
]

function Child () [
    return (
        <div>
            <h1>Child</h1>
            <Grandchild />
        </div>
    )
]

function Grandchild ({name}) [
    return (
        <Context.Consumer>
            { () => (
                <div>
                    <h1>Grandchild</h1>
                    <h3>Name: {name}</h3>
                </div>
            )}
        </Context.Consumer>
    )
]

function App extends React.Component {
    render () {
        const name = 'Sergio'

        return (
            <Context.Provider value={name}>
                <Parent />
            </Context.Provider>
        )
    }
}

render(<App />, document.getElementById('root'))
```

### Context.Provider
The `Provider` component is used in the upper level of the component tree; that is, the component from which the data to be passed is held. In our case, this was the `App` component. We passed the `name` data as the value of Provider's value prop. Note that the `Provider` component simply wraps around the entire component to be rendered!

### Context.Consumer
On the receiving end (i.e., a component "under" the Provider in the component hierarchy), we use the `Consumer` component. In our example, we passed `Consumer` a function as a child. This function accepts a value and returns some JSX. As a result, we were able to render the `Grandchild` component with the correct `name` data without ever having to pass that data down the entire component thread! That's a lot less code than the previous way we had to do it. So React's `Context` API provides a terse, approachable way to easily communicate information from one component to another.

Now, let's go ahead and utilize `Context` in the todos app.

### Pattern: Connected Components and Presentational Components

To apply the `Context` API in the todos app we have to follow the Connected/Presentational Components pattern whos abstract structur is:

    <ConnectedComponent>
        <PresentationalComponent>
    </ConectedComponent>

The point of these names are to help explain what the purpuse of the component is for:

- A **Connected Component** is connected to Redux store and is responsible for getting data from the store
- A **Presentational Component** should not access the store. It should receive any information it needs as props and then just render the UI.

### `connect()`: Under The Hood
The purpose is abstract all the connection between Redux and React like will a library. With the Connected/Presentational Pattern we have just half solution. It is remaining achieve that the user can grab the information off of the context without having to use `<Context.Consumer>`. So, we have an abstraction function called `connect()`.

The `connect()` function is a higer-order component that has three responsabilities:

- Know when the store changes - use the store subscripe
- What state is needed - use `mapStateToProps`
- Get the store from Context

The next snippet illustrates the logic of the `connect()` function:

```js
const ConnectedComponent = connect((state) => ({
    stateProp: state.prop
}))(PresentationalComponent)

function connect (mapStateToProps) {
    return (Component) => {
        class Receiver extends React.Component {
            componentDidMount () {
                const { subscribe } = this.props.store

                this.unsubscribe = subscribe(() => {
                    this.forceUpdate();
                })
            }

            componentWillMount () {
                this.unsubscribe()
            }

            render () {
                const { dispatch, getState } = this.props.store
                const state = getState
                const stateNeeded = mapStateToProps(state)

                return <Component {...stateNeeded} dispatch={dispatch} />

            }
        }

        class ConnectedComponent extends React.Component {
            render () {
                return (
                    <Context.Consumer>
                        {(store) => <Receiver store={store} />}
                    </Context.Consumer>
                )
            }
        }

        return ConnectedComponent;
    }
}
```

We just built out the `Provider`, `Context`, and `connect()` function. This function is so common that it has been developed into a library called [react-redux](https://github.com/reactjs/react-redux) that's officially supported by React. So instead of use our methods, we can import the library and use theirs functions.

### The `react-redux` Bindings

Let's take a moment to recap the changes we've made to our app in this Lesson, because we've updated quite a bit!

1.  We leveraged the standard `redux` library to build our app. This allowed us to create a Redux store with the `createStore()` function, giving us an API to listen (`subscribe()`), get updates (`getState()`)
2. We created our own `Provider` component to efficiently pass the store to components that needed it. As well as our own `connect()` function so that our components can access "slices" of state as `props`.

We can build a fully-functional React and Redux app without `Provider` or `connect()`, but since they greatly simplify how React components interact with the Redux store, the creators of redux have included them in the `react-redux` package!

### `Provider`
With `react-redux`, rather than creating and using our own `Provider` which looks like this:

```js
const Context = React.createContext(

class Provider extends React.Component {
    render () {
        return (
            <Context.Provider value={this.props.store}>
                {this.props.children}
            </Context.Provider>
        );
}
}

ReactDOM.render(
    <Provider store={store}>
        <ConnectedApp />
    </Provider>,
    document.getElementById('app')
);
```

but ...we can simply use the `Provider` component defined by the `react-redux` package! This allows us to wrap our entire app with `Provider`, effectively passing the store to even the most deeply nested components.

```js
ReactDOM.render(
    <ReactRedux.Provider store={store}>
        <ConnectedApp />
    </ReactRedux.Provider>,
    document.getElementById('app')
);
```

### `connect()`
Similarly, we can also leverage `react-redux`'s `connect()` function right out of the box. `connect()` is a higher-order function that takes in two arguments (as well as a few optional arguments) and _returns a function_. Check out its signature below:

```js
const buildConnectedComponent = connect(mapStateToProps, mapDispatchToProps);
```

What's vital to understand is that `buildConnectedComponent` is a function. `buildConnectedComponent` will take a regular (presentational) React component and return a new, "connected" component.

```js
const ConnectedComponent = buildConnectedComponent(MyComponent);
```

`ConnectedComponent` renders `MyComponent`, passing it the `props` as defined by `mapStateToProps` and `mapDispatchToPros`.

We can avoid having the intermediary buildConnectedComponent variable and just call the functions back-to-back:

```js
const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(MyComponent)
```

Notice the double set of parentheses!

The `connect()` method connects the Store with the Component. Also, `mapStateToProps` is a function that lets `connect()` know how to map `state` into the component’s list of `props`.

### Summary
React often leverages Redux for more predictable state management via the `react-redux` bindings. These bindings give us an API that simplifies the most common interactions between React and Redux.

`Provider` makes it possible for Redux to pass data from the store to any React components that need it. It uses React’s context feature to make this work.

`connect()` connects a React component to the Redux store. The `mapStateToProps()` function allows us to specify which state from the store you want passed to your React component, while the `mapDispatchToProps()` function allows us to bind dispatch to action creators before they ever hit the component.

Folder Structre
---------------

Currently, the app is all in a single file. This is a good idea for learning purposes but is far away of a real world app. Let's use the Create App Package to organize the todos/goals app's folder structure.

### "Rails-style" Organization

To recap, we've organized the individual elements of our app with a "Rails-style" approach. That is, assets are grouped by "type" or "capability": any action will be found in the _Actions_ folder, any reducer will be found in _Reducers_, and so on. In fact, the “real world” example from Redux on GitHub structures the app this very way. Under this directory structure, if we wanted to import all actions into a component, we can get them all in a single import!

    Frontend
        - Components
            - component1.js
            - component2.js
            - component3.js
        - Actions
            - action1.js
            - action2.js
        - Reducers
            - reducer1.js
        - Util
        - Store

### Other Patterns
Along with the "Rails style" of organizing your folder structure, you may find other approaches that developers use to build their directory more to your liking. An alternative way to structure the same application, then, is by feature:

    ├── dashboard
    │ ├── actions.js
    │ ├── index.js
    │ └── reducer.js
    └── nav
        ├── actions.js
        ├── index.js
        └── reducer.js

This form of organization groups assets by their common feature or “concept.” That is, all assets related to a navigation component are all together in a single, modular folder. It’s a great way to visually express what the application is all about. However, if the app contains several hundred components, it can become more difficult to navigate through.

This form of organization groups assets by their common feature or “concept.” That is, all assets related to a navigation component are all together in a single, modular folder. It’s a great way to visually express what the application is all about. However, if the app contains several hundred components, it can become more difficult to navigate through.

What's more: you might even see that some developers prefer a ["duck" style](https://medium.freecodecamp.org/scaling-your-redux-app-with-ducks-6115955638be) approach, where Redux and state management files are completely separated from files that render UI.

Ultimately, the choice is yours. Whichever way you choose to organize your directory structure, just be sure that it’s something that makes sense for your app, and it’s something you’re comfortable with!

### Summary
This section didn't accomplish anything with React or Redux. All we did here was improve the structure and organization of our app by moving each portion of the app to a specific folder structure.

To say it one more time, there's no "right" way to build out the folder structure for you app. However, doing it this way is handy because we're using the structure provided by Create React App. Using this structure, it's easy to convert a plain React application over to one that includes Redux. Another benefit is that other React developers will already be comfortable with this file/folder organization.