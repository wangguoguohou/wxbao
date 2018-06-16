import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import reducers from './reducers/reducers'
import Router from './routers/Router';
import registerServiceWorker from './registerServiceWorker';
// iconfont css
import './static/css/icon.css'
import './static/css/index.less'

const store = createStore(reducers, compose(
    applyMiddleware(thunk),
    window.devToolsExtension?window.devToolsExtension():f=>f
))

ReactDOM.render((
    <Provider store={store}>
        <Router />
    </Provider>
    // <Router />
), document.getElementById('root'));
registerServiceWorker();
