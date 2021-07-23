/*
主界面路由组件
*/

import React, {Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'

import LaobanInfo from '../laoban-info'
import DashenInfo from '../dashen-info'

class Main extends Component {
  render() {
    const {user} = this.props
    if(!user._id){
      return <Redirect to='/login'/>
    }
    return (
      <div>
        <Switch>
          <Route path='/laobaninfo' component={LaobanInfo}/>
          <Route path='/dasheninfo' component={DashenInfo}/>
        </Switch>
      </div>
    )
  }
}

export default connect(
  state => ({user: state.user}),
  {}
)
(Main)