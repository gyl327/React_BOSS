/*
选择用户头像的UI组件
 */

import React, {Component} from 'react'
import {List, Grid} from "antd-mobile"
import PropTypes from 'prop-types'

export default class HeaderSelector extends Component {

  static propTypes = {
    setHeader: PropTypes.func.isRequired
  }

  state = {
    icon: null //图片对象
  }

  constructor(props){
    super(props)
    //准备头像
    this.headerList = []
    for(let i = 0; i < 20; i++){
      this.headerList.push({
        text: '头像'+(i+1),
        icon: require(`../../assets/images/头像${i+1}.png`)
      })
    }
  }

  handleClick = ({text, icon}) => {
    //更新当前组件状态
      this.setState({icon})
    //调用函数更新父组件状态
      this.props.setHeader(text)
  }

  render() {
    const {icon} = this.state
    //头部界面
    const listHeader = !icon ? '请选择图像' : (
      <div>
        已选择图像: <img src={icon} alt=''/>
      </div>
    )
    return (
      <List renderHeader={() => listHeader}>
        <Grid data={this.headerList}
              columnNum={5}
              onClick={this.handleClick}/>
      </List>
    )
  }
}