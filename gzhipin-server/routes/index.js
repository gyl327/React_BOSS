var express = require('express');
var router = express.Router();

const md5 = require('blueimp-md5')
const {UserModel, ChatModel} = require('../db/models')
const filter = {password: 0, __v: 0}

//注册的路由
router.post('/register', function (req, res) {
  const {username, password, type} = req.body
  UserModel.findOne({username}, function (err, user) {
    if (user) {
      res.send({code: 1, msg: '此用户已存在'})
    } else {
      new UserModel({username, type, password: md5(password)}).save(function (err, user) {
        res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24 * 7})
        res.send({code: 0, data: {_id: user._id, username, type}})
      })
    }
  })
})

//登陆的路由
router.post('/login', function (req,res) {
  const {username, password} = req.body
  UserModel.findOne({username, password:md5(password)}, filter, function (err, user) {
    if(user){
      res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24 * 7})
      res.send({code:0, data: user})
    }else{
      res.send({code:1,msg:'用户名或密码不正确'})
    }
  })
})

//更新用户信息的路由
router.post('/update', function (req, res) {
  // 从请求的cookie得到userid
  const userid = req.cookies.userid
  // 如果不存在, 直接返回一个提示信息
  if(!userid) {
    return res.send({code: 1, msg: '请先登陆'})
  }
  // 存在, 根据userid更新对应的user文档数据
  // 得到提交的用户数据
  const user = req.body // 没有_id
  UserModel.findByIdAndUpdate({_id: userid}, user, function (error, oldUser) {

    if(!oldUser) {
      // 通知浏览器删除userid cookie
      res.clearCookie('userid')
      // 返回返回一个提示信息
      res.send({code: 1, msg: '请先登陆'})
    } else {
      // 准备一个返回的user数据对象
      const {_id, username, type} = oldUser
      const data = Object.assign({_id, username, type}, user)
      // 返回
      res.send({code: 0, data})
    }
  })
})

//获取用户信息的路由（根据cookie中的userid）
router.get('/user', function (req, res) {
  // 从请求的cookie得到userid
  const userid = req.cookies.userid
  // 如果不存在, 直接返回一个提示信息
  if(!userid) {
    return res.send({code: 1, msg: '请先登陆'})
  }
  UserModel.findOne({_id: userid}, filter, function (error, user) {
    res.send({code: 0, data: user})
  })
})

//获取用户列表
router.get('/userlist', function (req, res) {
  const {type} = req.query
  UserModel.find({type}, filter, function (err, users) {
    res.send({code: 0, data: users})
  })
})

//获取当前用户所有相关聊天信息列表
router.get('/msglist', function (req, res) {
  // 获 取 cookie 中 的 userid
  const userid = req.cookies.userid
  // 查 询 得 到 所 有 user 文 档 数 组
  UserModel.find(function (err, userDocs) {
    // 用 对 象 存 储 所 有 user 信 息 :
    // key 为 user 的 _id, val为 name和 header组 成 的 user对 象
    const users = {} //对 象 容 器
    userDocs.forEach(doc => {
      users[doc._id] = {username: doc.username, header: doc.header}
    })
    /*
    查 询 userid 相 关 的 所 有 聊 天 信 息 参 数
    1: 查询条件参数
    2: 过滤条件参数
    3: 回调函数
    */
    ChatModel.find({'$or': [{from: userid}, {to: userid}]}, filter, function (err, chatMsgs) {
      // 返 回 包 含 所 有 用 户 和 当 前 用 户 相 关 的 所 有 聊 天 消 息 的 数 据
      res.send({code: 0, data: {users, chatMsgs}})
    })
  })
})

/* 修 改 指 定 消 息 为 已 读 */
router.post('/readmsg', function (req, res) {
  // 得 到 请 求 中 的 from 和 to
  const from = req.body.from
  const to = req.cookies.userid
  /* 更 新 数 据 库 中 的 chat数 据
  参 数 1:查 询 条 件
  参 数 2:更 新 为 指 定 的 数 据 对 象
  参 数 3:是 否 1次 更 新 多 条 ,默 认 只 更 新 一 条
  参 数 4: 新 完 成 的 回 调 函 数
  */
  ChatModel.update({from, to, read: false}, {read: true}, {multi: true}, function (err, doc) {
    console.log('/readmsg', doc)
    res.send({code: 0, data: doc.nModified}) // 更 新 的 数 量
  })
})


  /* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
