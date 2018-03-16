const wechat = require('./wechat/wechat');
const express = require('express');
const config = require('./config');//引入配置文件
const path = require('path');
const app = express()
// app.set('views', path.join(__dirname, './views'));
var wechatApp = new wechat(config); //实例wechat 模块

//用于处理所有进入 3000 端口 get 的连接请求
app.get('/', function (req, res) {
  // wechatApp.auth(req, res);
  console.log('0000000', res)
  app.use(express.static(path.join(__dirname, 'public')));
  // res.sendfile('./views/index.html');
});

//用于处理所有进入 3000 端口 post 的连接请求
app.post('/', function (req, res) {
  wechatApp.handleMsg(req, res);
});

//用于请求获取 access_token
app.get('/getAccessToken', function (req, res) {
  // wechatApp.getAccessToken().then(function (data) {
  //   res.send(data);
  // });
  wechatApp.getAccessToken(req, res)
});




var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});



