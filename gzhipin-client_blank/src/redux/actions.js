/*
/包含n个action creator
 */
import {reqLogin, reqRegister} from '../api'
import {AUTH_SUCCESS, ERROR_MSG} from './action-types'

//授权成功的同步action
const authSuccess = (user) => ({type: AUTH_SUCCESS, data: user})
//错误提示信息的同步action
const errorMsg = (msg) => ({type: ERROR_MSG, data: msg})

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

//注册登录action
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