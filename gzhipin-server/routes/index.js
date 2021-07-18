var express = require('express');
var router = express.Router();

const md5 = require('blueimp-md5')
const {UserModel} = require('../db/models')


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


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
