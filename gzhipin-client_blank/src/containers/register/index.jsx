/*
注册路由组件
*/
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Redirect} from "react-router-dom";
import {
  NavBar,
  WingBlank,
  List,
  InputItem,
  Button,
  Radio,
  WhiteSpace
} from 'antd-mobile'

import Logo from '../../components/logo/logo'
import {register} from '../../redux/actions'

const ListItem = List.Item

class Register extends Component {
  state = {
    username: '',
    password: '',
    password2: '',
    type: 'dashen',//用户类型
  }
  register = () => {
    this.props.register(this.state)
  }
  handleChange = (name, val) => {
    this.setState({
      [name]: val
    })
  }
  toLogin = () => {
    this.props.history.replace('/login')
  }

  render() {
    const {type} = this.state
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
            <InputItem placeholder='请确认密码' type="password" onChange={val => {this.handleChange('password2',val)}}>确认密码：</InputItem>
            <WhiteSpace/>
            <ListItem>
              <span>用户类型：</span>
              &nbsp;&nbsp;&nbsp;
              <Radio checked={type === 'dashen'} onChange={() => {this.handleChange('type','dashen')}}>大神</Radio>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Radio checked={type === 'BOSS'} onChange={() => {this.handleChange('type','BOSS')}}>BOSS</Radio>
            </ListItem>
            <Button type='primary' onClick={this.register}>注册</Button>
            <WhiteSpace/>
            <Button onClick={this.toLogin}>已有帐户，登录</Button>
          </List>
        </WingBlank>
      </div>
    )
  }
}

export default connect(
  state => ({user:state.user}),
  {register}
)(Register)