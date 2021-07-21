/*
登录路由组件
*/

import React, {Component} from 'react'
import {
  NavBar,
  WingBlank,
  List,
  InputItem,
  Button,
  WhiteSpace
} from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from "react-router-dom";
import {login} from '../../redux/actions'
import Logo from '../../components/logo/logo'

class Login extends Component {
  state = {
    username: '',
    password: '',
  }

  login = () => {
    this.props.login(this.state)
  }

  handleChange = (name, val) => {
    this.setState({
      [name]: val
    })
  }

  toRegister = () => {
    this.props.history.replace('/register')
  }

  render() {
    const {msg, redirectTo} = this.props.user
    //重定向到指定路由
    if (redirectTo){
      return <Redirect to={redirectTo}/>
    }
    return (
      <div>
        <NavBar>X&nbsp;X&nbsp;直&nbsp;聘</NavBar>
        <Logo/>
        <WingBlank>
          <List>
            {msg?<div className='error-msg'>{msg}</div>:null}
            <WhiteSpace/>
            <InputItem placeholder='请输入用户名' onChange={val => {this.handleChange('username',val)}}>用户名：</InputItem>
            <WhiteSpace/>
            <InputItem placeholder='请输入6位数密码' type="password" onChange={val => {this.handleChange('password',val)}}>密&nbsp;&nbsp;&nbsp;码：</InputItem>
            <WhiteSpace/>
            <Button type='primary' onClick={this.login}>登录</Button>
            <WhiteSpace/>
            <Button onClick={this.toRegister}>没有账户，去注册</Button>
          </List>
        </WingBlank>
      </div>
    )
  }
}

export default connect(
  state => ({user:state.user}),
  {login}
)(Login)