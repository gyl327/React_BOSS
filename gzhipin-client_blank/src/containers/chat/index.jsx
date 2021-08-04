/*
对 话 聊 天 的 路 由 组 件
* */
import React, {Component} from 'react'
import {NavBar, List, InputItem, Grid, Icon} from 'antd-mobile'
import {connect} from 'react-redux'

import {sendMsg, readMsg} from '../../redux/actions'

const Item = List.Item

class Chat extends Component {

  state = {
    content: '',
    isShow: false //是否显示表情列表
  }

  //在第一次render之前
  componentWillMount() {
    const emojis = ['😀', '😁', '🤣','😀', '😁', '🤣','😀', '😁', '🤣','😀', '😁', '🤣','😀'
      ,'😁', '🤣','😀', '😁', '🤣','😀', '😁', '🤣','😀', '😁', '🤣'
      ,'😁', '🤣','😀', '😁', '🤣','😀', '😁', '🤣','😀', '😁', '🤣'
      ,'😁', '🤣','😀', '😁', '🤣','😀', '😁', '🤣','😀', '😁', '🤣']
    this.emojis = emojis.map(emoji => ({text: emoji}))
  }

  componentDidMount() {
    window.scrollTo(0, document.body.scrollHeight)
  }

  componentDidUpdate() {
    window.scrollTo(0, document.body.scrollHeight)
  }

  componentWillUnmount() {
    //发请求更新消息的维度状态
    const from =this.props.match.params.userid
    const to = this.props.user._id
    this.props.readMsg(from, to)
  }

  toggleShow = () => {
    const isShow = !this.state.isShow
    this.setState({isShow})
    if(isShow){
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'))
      }, 0)
    }
  }

  handleSend = () => {
    // 收集数据
    const from = this.props.user._id
    const to = this.props.match.params.userid
    const content = this.state.content.trim()
    // 发送请求(发消息)
    if(content) {
      this.props.sendMsg({from, to, content})
    }
    //请求输入数据
    this.setState({content: '', isShow: false})
  }

  render() {
    const {user} = this.props
    const {users, chatMsgs} = this.props.chat

    //计算当前聊天的chat_id
    const meId = user._id
    if(!users[meId]){
      return null
    }
    const targetId = this.props.match.params.userid
    const chatId = [meId, targetId].sort().join('_')

    //对chatMsgs进行过滤
    const msgs = chatMsgs.filter(msg => msg.chat_id === chatId)

    //目标用户的头像
    const targetHeader = users[targetId].header
    const targetIcon = targetHeader ? require(`../../assets/images/${targetHeader}.png`) : null

    return (
      <div id='chat-page'>
        <NavBar
          icon={<Icon type='left'/>}
          className='sticky-header'
          onLeftClick={() => this.props.history.goBack()}
        >
          {users[targetId].username}
         </NavBar>
        <List style={{marginTop: 50, marginBottom: 50}}>
          {
            msgs.map(msg => {
              if(meId === msg.to){  //对方发给我
                return (
                  <Item
                    key = {msg._id}
                    thumb = {targetIcon}
                  >
                    {msg.content}
                  </Item>
                )
              }else{  //我发的消息
                return (
                  <Item
                    key = {msg._id}
                    className='chat-me'
                    extra='我'
                  >
                    {msg.content}
                  </Item>
                )
              }
            })
          }
        </List>
        <div className='am-tab-bar'>
          <InputItem
            placeholder="请输入"
            value={this.state.content}
            onChange={val => this.setState({content: val})}
            onFocus={() => this.setState({isShow: false})}
            extra={
              <span>
                <span onClick={this.toggleShow} style={{marginRight: 5}}>😀</span>
                <span onClick={this.handleSend}>发送</span>
              </span>
            }
          />
          {this.state.isShow ? (
            <Grid
              data={this.emojis}
              columnNum={8}
              carouselMaxRow={4}
              isCarousel={true}
              onClick={(item) => {
                this.setState({content: this.state.content + item.text})
              }}
            />
          ) : null}
         </div>
       </div>
    )
  }
}

export default connect(
  state => ({user: state.user, chat: state.chat}),
  {sendMsg, readMsg}
)(Chat)
