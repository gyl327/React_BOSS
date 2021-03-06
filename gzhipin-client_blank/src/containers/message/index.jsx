/*
消息主界面
 */

import React, {Component} from 'react'
import {connect} from 'react-redux'
import {List, Badge} from 'antd-mobile'

const Item = List.Item
const Brief = Item.Brief

function getLastMsgs(chatMsgs, userid) {
  const lastMsgObjs = {}
  chatMsgs.forEach(msg => {
    if(msg.to === userid && !msg.read){
      msg.unReadCount = 1
    }else{
      msg.unReadCount = 0
    }

    // 得到msg的聊天标识id
    const chatId = msg.chat_id
    // 获取已保存的当前组件的lastMsg
    let lastMsg = lastMsgObjs[chatId]
    if(!lastMsg){
      //当前msg就是所在组的lastMsg
      lastMsgObjs[chatId] = msg
    }else{
      const unReadCount = lastMsg.unReadCount + msg.unReadCount
      if(msg.create_time > lastMsg.create_time) {
        lastMsgObjs[chatId] = msg
      }
      lastMsgObjs[chatId].unReadCount = unReadCount
    }
  })
  // 2. 得到所有lastMsg的数组
  const lastMsgs = Object.values(lastMsgObjs)
  //排序
  // 3. 对数组进行排序(按create_time降序)
  lastMsgs.sort(function (m1, m2) { // 如果结果<0, 将m1放在前面, 如果结果为0, 不变, 如果结果>0, m2前面
    return m2.create_time - m1.create_time
  })
  return lastMsgs
}

class Message extends Component {

  render() {
    const {user} = this.props
    const {users, chatMsgs} = this.props.chat

    //对 chatMsgs 分组 按 chat_id
    const lastMsgs = getLastMsgs(chatMsgs, user._id)

    return (
      <List style={{marginTop:50, marginBottom:50}}>

        {
          lastMsgs.map(msg => {
            // 得到目标用户的id
            const targetUserId = msg.to===user._id ? msg.from : msg.to
            // 得到目标用户的信息
            const targetUser = users[targetUserId]
            return (
              <Item
                key={msg._id}
                extra={<Badge text={msg.unReadCount}/>}
                thumb={targetUser.header ? require(`../../assets/images/${targetUser.header}.png`) : null}
                arrow='horizontal'
                onClick={() => this.props.history.push(`/chat/${targetUserId}`)}
              >
                {msg.content}
                <Brief>{targetUser.username}</Brief>
              </Item>
            )
        })
        }
      </List>
    )
  }
}

export default connect(
  state => ({user: state.user, chat: state.chat}),
  {}
)(Message)