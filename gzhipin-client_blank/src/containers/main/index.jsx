/*
主界面路由组件
*/

import React, {Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import Cookies from 'js-cookie'

import LaobanInfo from '../laoban-info'
import DashenInfo from '../dashen-info'
import {getRedirectTo} from '../../utils'
import {getUser} from '../../redux/actions'

class Main extends Component {

  componentDidMount() {
    //登陆过，但是现在没有登录，发请求获取对应的user
    const userid = Cookies.get('userid')
    const {_id} = this.props.user
    if(userid && !_id){
      //发送异步请求，获取user
      this.props.getUser()
    }
  }

  render() {
    //读取cookie中的userid
    const userid = Cookies.get('userid')
    // 没有重定向到登录界面
    if(!userid){
      return <Redirect to='/login'/>
    }
    //有userid
    const {user} = this.props
    //user中没有_id
    if(!user._id){
      return null
    }else{
      //user中有_id
      let path = this.props.location.pathname
      if(path === '/'){
        path = getRedirectTo(user.type, user.header)
        return <Redirect to={path}/>
      }
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
  {getUser}
)
(Main)