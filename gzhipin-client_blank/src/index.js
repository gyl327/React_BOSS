import React from 'react'
import ReactDOM from 'react-dom'
import {HashRouter, Route, Switch} from "react-router-dom"
import {Provider} from 'react-redux'

import Register from './containers/register'
import Login from './containers/login'
import Main from './containers/main'
import store from './redux/store'

ReactDOM.render( (
  <Provider store={store}>
    <HashRouter>
      <Switch>
        <Route path='/register' component={Register}></Route>
        <Route path='/login' component={Login}></Route>
        <Route component={Main}></Route>
      </Switch>
    </HashRouter>
  </Provider>
), document.getElementById('root'))