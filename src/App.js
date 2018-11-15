import React from "react"
import {Root} from "native-base"
import {appReducer, AppWithNavigationState} from "./routers/navigations"
import {Provider} from 'react-redux';
import {
    createStore,
    applyMiddleware,
} from 'redux';

const store = createStore(
    appReducer,
    applyMiddleware(),
);

export default class App extends React.Component {
    componentDidMount() {
        console.log('----------------', this.props)
    }

    render() {
        return (
            <Provider store={store}><AppWithNavigationState/></Provider>
        )
    }
}
