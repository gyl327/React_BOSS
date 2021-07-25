/*
/包含n个action creator
 */

import {reqLogin, reqRegister, reqUpdateUser, reqUser, reqUserList} from '../api'
import {AUTH_SUCCESS, ERROR_MSG, RECEIVE_USER, RESET_USER, RECEIVE_USER_LIST} from './action-types'

// 授权成功的同步action
const authSuccess = (user) => ({type: AUTH_SUCCESS, data: user})
// 错误提示信息的同步action
const errorMsg = (msg) => ({type: ERROR_MSG, data: msg})
// 接收用户的同步action
const receiveUser = (user) => ({type: RECEIVE_USER, data:user})
// 重置用户的同步action
export const resetUser = (msg) => ({type: RESET_USER, data: msg})
// 接收用户列表的同步action
export const receiveUserList = (userList) => ({type: RECEIVE_USER_LIST, data: userList})

//注册异步action
export const register = (user) => {
  const {username, password, password2, type} = user

  //表单的前台验证
  if (password !== password2){
    return errorMsg('两次密码不一致')
  }else if (!username){
    return errorMsg('用户名不能为空')
  }

  return async dispatch => {
    //发送注册异步请求
    const response = await reqRegister({username, password, type})
    const result = response.data
    if(result.code === 0){
      dispatch(authSuccess(result.data))
    }else{
      dispatch(errorMsg(result.msg))
    }
  }
}

//登录异步action
export const login = (user) => {
  const {username, password} = user

  //表单的前台验证
  if (!password){
    return errorMsg('密码不能为空')
  }else if (!username){
    return errorMsg('用户名不能为空')
  }

  return async dispatch => {
    //发送注册异步请求
    const response = await reqLogin(user)
    const result = response.data
    if(result.code === 0){
      dispatch(authSuccess(result.data))
    }else{
      dispatch(errorMsg(result.msg))
    }
  }
}

//更新异步action
export const updateUser = (user) => {
  return async dispatch => {
    const response = await reqUpdateUser(user)
    const result = response.data
    if(result.code === 0){
      dispatch(receiveUser(result.data))
    }else{
      dispatch(resetUser(result.msg))
    }
  }
}

// 获取用户异步action
export const getUser = () => {
  return async dispatch => {
    // 执行异步ajax请求
    const response = await reqUser()
    const result = response.data
    if(result.code===0) { // 成功
      // getMsgList(dispatch, result.data._id)
      dispatch(receiveUser(result.data))
    } else { // 失败
      dispatch(resetUser(result.msg))
    }
  }
}

// 获取用户列表的异步action
export const getUserList = (type) => {
  return async dispatch => {
    // 执行异步ajax请求
    const response = await reqUserList(type)
    const result = response.data
    // 得到结果后, 分发一个同步action
    if(result.code===0) {
      dispatch(receiveUserList(result.data))
    }
  }
}
