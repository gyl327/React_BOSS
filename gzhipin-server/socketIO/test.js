module.exports = function (server) {
  const io = require('socket.io')(server,{cors:true})

  //监视客户端与服务器的连接
  io.on('connection', function (socket) {
    console.log('客户端连接上了服务器')

    //绑定监听，接收客户端数据
    socket.on('sendMsg', function (data) {
      console.log('服务端接收到消息', data)
      //处理数据
      data.name = data.name.toUpperCase()
      //服务端向客户端发送消息
      socket.emit('receiveMsg', data)
      console.log('服务端向客户端发送消息', data)
    })
  })
}

