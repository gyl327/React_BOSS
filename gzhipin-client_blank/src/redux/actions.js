/*
/包含n个action creator
 */
import io from 'socket.io-client'

import {
  reqLogin,
  reqRegister,
  reqUpdateUser,
  reqUser,
  reqUserList,
  reqChatMsgList,
  reqReadMsg} from '../api'
import {
  AUTH_SUCCESS,
  ERROR_MSG,
  RECEIVE_USER,
  RESET_USER,
  RECEIVE_USER_LIST,
  RECEIVE_MSG,
  RECEIVE_MSG_LIST,
  MSG_READ} from './action-types'

function initIO(dispatch, userid) {
  if(!io.socket){
    // 连接服务器, 得到与服务器的连接对象
    io.socket = io('ws://192.168.58.1:4000')
    //绑定监听，接收消息
    io.socket.on('receiveMsg', function (chatMsg) {
      console.log('客户端接收服务器发送的消息', chatMsg)
      //只有当chatMsg是与当前用户相关的信息才分发同步action
      if(userid === chatMsg.from || userid === chatMsg.to){
        dispatch(receiveMsg(chatMsg, userid))
      }
    })
  }
}

// 异步获取消息列表数据
async function getMsgList(dispatch, userid) {
  initIO(dispatch, userid)
  const response = await reqChatMsgList()
  const result = response.data
  if(result.code===0) {
    const {users, chatMsgs} = result.data
    // 分发同步action
    dispatch(receiveMsgList({users, chatMsgs, userid}))
  }
}

// 授权成功的同步action
const authSuccess = (user) => ({type: AUTH_SUCCESS, data: user})
// 错误提示信息的同步action
const errorMsg = (msg) => ({type: ERROR_MSG, data: msg})
// 接收用户的同步action
const receiveUser = (user) => ({type: RECEIVE_USER, data:user})
// 重置用户的同步action
export const resetUser = (msg) => ({type: RESET_USER, data: msg})
// 接收用户列表的同步action
const receiveUserList = (userList) => ({type: RECEIVE_USER_LIST, data: userList})
// 接收消息列表的同步action
const receiveMsgList = ({users, chatMsgs, userid}) => ({type: RECEIVE_MSG_LIST, data:{users, chatMsgs, userid}})
// 接收一个消息的同步action
const receiveMsg = (chatMsg, userid) => ({type: RECEIVE_MSG, data: {chatMsg, userid}})
//读取某个聊天消息
const msgRead = ({count, from, to}) => ({type: MSG_READ, data: {count, from, to}})


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
      getMsgList(dispatch, result.data._id)
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
      getMsgList(dispatch, result.data._id)
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
      getMsgList(dispatch, result.data._id)
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

// 发送消息的异步action
export const sendMsg = ({from, to, content}) => {
  return dispatch => {
    console.log('客户端向服务器发送消息', {from, to, content})
    // 发消息
    io.socket.emit('sendMsg', {from, to, content})
  }
}

//读取消息的异步action
export const readMsg = (from, to) => {
  return async dispatch => {
    const response = await reqReadMsg(from)
    const result = response.data
    if(result.code === 0){
      const count = result.data
      dispatch(msgRead({count, from, to}))
    }
  }
}

