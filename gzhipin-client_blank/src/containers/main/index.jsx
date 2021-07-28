/*
主界面路由组件
*/

import React, {Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import Cookies from 'js-cookie'
import {NavBar} from "antd-mobile"

import LaobanInfo from '../laoban-info'
import DashenInfo from '../dashen-info'
import Dashen from '../dashen'
import Laoban from '../laoban'
import Message from '../message'
import Personal from '../personal'
import NotFound from '../../components/not-found'
import NavFound from '../../components/nav-footer'
import Chat from '../chat'

import {getRedirectTo} from '../../utils'
import {getUser} from '../../redux/actions'

class Main extends Component {

  //给组件对象添加属性
  navList = [
    {
      path: '/laoban',
      component: Laoban,
      title: '大神列表',
      icon: 'dashen',
      text: '大神',
    },
    {
      path: '/dashen',
      component: Dashen,
      title: '老板列表',
      icon: 'laoban',
      text: '老板',
    },
    {
      path: '/message',
      component: Message,
      title: '消息列表',
      icon: 'message',
      text: '消息',
    },
    {
      path: '/personal',
      component: Personal,
      title: '用户中心',
      icon: 'personal',
      text: '个人',
    }
  ]

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
    const {navList} = this
    const path = this.props.location.pathname
    const currentNav = navList.find(nav => nav.path === path)

    if(currentNav){
      if(user.type === 'laoban'){
        navList[1].hide = true
      } else {
        navList[0].hide = true
      }
    }

    return (
      <div>
        {currentNav ? <NavBar className='sticky-header'>{currentNav.title}</NavBar> : null}
        <Switch>
          {
            navList.map(nav => <Route key={nav.path} path={nav.path} component={nav.component}/>)
          }
          <Route path='/laobaninfo' component={LaobanInfo}/>
          <Route path='/dasheninfo' component={DashenInfo}/>
          <Route path='/chat/:userid' component={Chat}/>
          <Route component={NotFound}/>
        </Switch>
        {currentNav ? <NavFound navList={navList}/> : null}
      </div>
    )
  }
}

export default connect(
  state => ({user: state.user}),
  {getUser}
)(Main)