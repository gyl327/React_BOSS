import React from 'react'
import ReactDOM from 'react-dom'
import {HashRouter, Route, Switch} from "react-router-dom"
import {Provider} from 'react-redux'

import './test/sockio_test'

import Register from './containers/register'
import Login from './containers/login'
import Main from './containers/main'
import store from './redux/store'
import './assets/css/index.less'

ReactDOM.render((
  <Provider store={store}>
    <HashRouter>
      <Switch>
        <Route path="/register" component={Register}/>
        <Route path="/login" component={Login}/>
        <Route component={Main}></Route> 默认路由
      </Switch>
    </HashRouter>
  </Provider>
), document.getElementById('root'))