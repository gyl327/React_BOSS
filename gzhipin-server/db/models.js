/*
包含n个能操作mongodb数据库集合的model的模块
*/

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/bossz')
const conn = mongoose.connection
conn.on('connected', function () {
  console.log('数据库连接成功!')
})

const userSchema = mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  type: {type: String, required: true},
  header: {type: String},
  post: {type: String},
  info: {type: String},
  company: {type: String},
  salary: {type: String}
})

const UserModel = mongoose.model('user', userSchema)

exports.UserModel = UserModel

//定 义 chats集 合 的 文 档 结 构
const chatSchema = mongoose.Schema({
  from: {type: String, required: true}, //发 送 用 户 的 id
  to: {type: String, required: true}, //接 收 用 户 的 id
  chat_id: {type: String, required: true}, // from 和 to组 成 的 字 符 串
  content: {type: String, required: true}, //内 容
  read: {type:Boolean, default: false}, //标 识 是 否 已 读
  create_time: {type: Number} //创 建 时 间
})
//定 义 能 操 作 chats集 合 数 据 的Model
const ChatModel = mongoose.model('chat', chatSchema)
// 向 外 暴 露 Model
exports.ChatModel = ChatModel
