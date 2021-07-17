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

import Logo from '../../components/logo/logo'

export default class Login extends Component {
  state = {
    username: '',
    password: '',
  }

  login = () => {
    console.log(this.state)
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
    return (
      <div>
        <NavBar>X&nbsp;X&nbsp;直&nbsp;聘</NavBar>
        <Logo/>
        <WingBlank>
          <List>
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