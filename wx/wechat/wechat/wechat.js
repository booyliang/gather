'use strict' //设置为严格模式
const request = require('request');
const crypto = require('crypto'); //引入加密模块
const https = require('https'); //引入 htts 模块
const waterfall = require('async/waterfall')
const util = require('util'); //引入 util 工具包
const fs = require('fs');//引入 fs 模块
const urltil = require('url');//引入 url 模块
const accessTokenJson = require('./access_token') //引入本地存储的 access_token
const NodeCache = require('node-cache')
const cache = new NodeCache({ stdTTL: 7200, checkperiod: 7200 }) //3600秒后过过期

/**
 * 构建 WeChat 对象 即 js中 函数就是对象
 * @param {JSON} config 微信配置文件 
 */
var WeChat = function (config) {
	//设置 WeChat 对象属性 config
	this.config = config;
	//设置 WeChat 对象属性 token
	this.token = config.token;
	//设置 WeChat 对象属性 appID
	this.appID = config.appID;
	//设置 WeChat 对象属性 appScrect
	this.appScrect = config.appScrect;
	//设置 WeChat 对象属性 apiDomain
	this.apiDomain = config.apiDomain;
	//设置 WeChat 对象属性 apiURL
	this.apiURL = config.apiURL;

    /**
     * 用于处理 https Get请求方法
     * @param {String} url 请求地址 
     */
	this.requestGet = function (url) {
		return new Promise(function (resolve, reject) {
			https.get(url, function (res) {
				var buffer = [], result = "";
				//监听 data 事件
				res.on('data', function (data) {
					buffer.push(data);
				});
				//监听 数据传输完成事件
				res.on('end', function () {
					result = Buffer.concat(buffer).toString('utf-8');
					//将最后结果返回
					resolve(result);
				});
			}).on('error', function (err) {
				reject(err);
			});
		});
	}

    /**
     * 用于处理 https Post请求方法
     * @param {String} url  请求地址
     * @param {JSON} data 提交的数据
     */
	this.requestPost = function (url, data) {
		return new Promise(function (resolve, reject) {
			//解析 url 地址
			var urlData = urltil.parse(url);
			//设置 https.request  options 传入的参数对象
			var options = {
				//目标主机地址
				hostname: urlData.hostname,
				//目标地址 
				path: urlData.path,
				//请求方法
				method: 'POST',
				//头部协议
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Content-Length': Buffer.byteLength(data, 'utf-8')
				}
			};
			var req = https.request(options, function (res) {
				var buffer = [], result = '';
				//用于监听 data 事件 接收数据
				res.on('data', function (data) {
					buffer.push(data);
				});
				//用于监听 end 事件 完成数据的接收
				res.on('end', function () {
					result = Buffer.concat(buffer).toString('utf-8');
					resolve(result);
				})
			})
				//监听错误事件
				.on('error', function (err) {
					console.log(err);
					reject(err);
				});
			//传入数据
			req.write(data);
			req.end();
		});
	}
}

/**
 * 微信接入验证
 * @param {Request} req Request 对象
 * @param {Response} res Response 对象
 */
WeChat.prototype.auth = function (req, res) {

	// var that = this;
	// this.getAccessToken().then(function(data){
	//     //格式化请求连接
	//     var url = util.format(that.apiURL.createMenu,that.apiDomain,data);
	//     //使用 Post 请求创建微信菜单
	//     that.requestPost(url,JSON.stringify(menus)).then(function(data){
	//         //讲结果打印
	//         console.log(data);
	//     });
	// });

	//1.获取微信服务器Get请求的参数 signature、timestamp、nonce、echostr
	var signature = req.query.signature,//微信加密签名
		timestamp = req.query.timestamp,//时间戳
		nonce = req.query.nonce,//随机数
		echostr = req.query.echostr;//随机字符串

	//2.将token、timestamp、nonce三个参数进行字典序排序
	var array = [this.token, timestamp, nonce];
	array.sort();

	//3.将三个参数字符串拼接成一个字符串进行sha1加密
	var tempStr = array.join('');
	const hashCode = crypto.createHash('sha1'); //创建加密类型 
	var resultCode = hashCode.update(tempStr, 'utf8').digest('hex'); //对传入的字符串进行加密

	//4.获得加密后的字符串可与signature对比，标识该请求来源于微信
	if (resultCode === signature) {
		res.send(echostr);
	} else {
		res.send('mismatch');
	}
}

/**
 * 获取微信 access_token
 */
// WeChat.prototype.getAccessToken = function () {
// 	var that = this;
// 	return new Promise(function (resolve, reject) {
// 		//获取当前时间 
// 		var currentTime = new Date().getTime();
// 		//格式化请求地址
// 		var url = util.format(that.apiURL.accessTokenApi, that.apiDomain, that.appID, that.appScrect);
// 		//判断 本地存储的 access_token 是否有效
// 		if (accessTokenJson.access_token === "" || accessTokenJson.expires_time < currentTime) {
// 			that.requestGet(url).then(function (data) {
// 				var result = JSON.parse(data);
// 				if (data.indexOf("errcode") < 0) {
// 					accessTokenJson.access_token = result.access_token;
// 					accessTokenJson.expires_time = new Date().getTime() + (parseInt(result.expires_in) - 200) * 1000;
// 					//更新本地存储的
// 					fs.writeFile('./wechat/access_token.json', JSON.stringify(accessTokenJson));
// 					//将获取后的 access_token 返回
// 					resolve(accessTokenJson.access_token);
// 				} else {
// 					//将错误返回
// 					resolve(result);
// 				}
// 			});
// 		} else {
// 			//将本地存储的 access_token 返回
// 			resolve(accessTokenJson.access_token);
// 		}
// 	});
// }

WeChat.prototype.getAccessToken = function (req, res) {
	var that = this;
	let grant_type = 'client_credential'
	//设置 WeChat 对象属性 appID
	let appid = that.config.appID
	//设置 WeChat 对象属性 appScrect
	let secret = that.config.appScrect // appscret

	let steps = []

	// 第一步，获取access_token
	steps.push((cb) => {

		let steps1 = []

		// 第1.1步，从缓存中读取access_token
		steps1.push((cb1) => {
			let access_token = cache.get('access_token', (err, access_token) => {
				cb1(err, access_token)
			})
		})

		// 第1.2步，缓存中有access_token则直接返回，如果没有，则从服务器中读取access_token
		steps1.push((access_token, cb1) => {
			if (access_token) {
				cb1(null, access_token, 'from_cache')
			} else {
				request('https://api.weixin.qq.com/cgi-bin/token?grant_type=' + grant_type + '&appid=' + appid + '&secret=' + secret, (err, response, body) => {
					cb1(err, JSON.parse(body).access_token, 'from_server')
				})
			}
		})

		// 第1.3步，如果是新从服务器取的access_token，则缓存起来，否则直接返回
		steps1.push((access_token, from_where, cb1) => {
			if (from_where === 'from_cache') {
				console.log(' === 成功从缓存中读取access_token: ' + access_token + ' ===')
				cb1(null, access_token)
			} else if (from_where === 'from_server') {
				cache.set('access_token', access_token, (err, success) => {
					if (!err && success) {
						console.log(' === 缓存已过期，从服务器中读取access_token: ' + access_token + ' ===')
						cb1(null, access_token)
					} else {
						cb1(err || 'cache设置access_token时，出现未知错误')
					}
				})
			} else {
				cb1('1.3获取from_where时，from_where值为空')
			}
		})

		waterfall(steps1, (err, access_token) => {
			cb(err, access_token)
		})
	})


	// 第二步，获取ticket
	steps.push((access_token, cb) => {
		let steps1 = []

		// 第2.1步，从缓存中读取ticket
		steps1.push((cb1) => {
			let ticket = cache.get('ticket', (err, ticket) => {
				cb1(err, ticket)
			})
		})

		// 第2.2步，缓存中有ticket则直接返回，如果没有，则从服务器中读取ticket
		steps1.push((ticket, cb1) => {
			if (ticket) {
				cb1(null, ticket, 'from_cache')
			} else {
				request('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + access_token + '&type=jsapi', (err, response, body) => {
					cb1(err, JSON.parse(body).ticket, 'from_server')
				})
			}
		})

		// 第2.3步，如果新从服务器取的ticket，则缓存起来，否则直接返回
		steps1.push((ticket, from_where, cb1) => {
			if (from_where === 'from_cache') {
				console.log(' === 成功从缓存中读取ticket: ' + ticket + ' ===')
				cb1(null, ticket)
			} else if (from_where === 'from_server') {
				cache.set('ticket', ticket, (err, success) => {
					if (!err && success) {
						console.log(' === 缓存已过期，从服务器中读取ticket: ' + ticket + ' ===');
						cb1(null, ticket)
					} else {
						cb1(err || 'cache设置ticket时，出现未知错误')
					}
				})
			} else {
				cb1('2.3获取from_where时，from_where值为空')
			}
		})

		waterfall(steps1, (err, ticket) => {
			cb(err, ticket)
		})
	})


	// 第三步，生成签名
	steps.push((ticket, cb) => {
		let jsapi_ticket = ticket
		let nonce_str = '123456'
		let timestamp = new Date().getTime();
		let url = req.query.url

		let str = 'jsapi_ticket=' + jsapi_ticket + '&noncestr=' + nonce_str + '&timestamp=' + timestamp + '&url=' + url
		// let signature = sha1(str)
		let hashCode = crypto.createHash('sha1'); //创建加密类型 
		let signature = hashCode.update(str, 'utf8').digest('hex'); //对传入的字符串进行加密

		cb(null, {
			appId: appid,
			timestamp: timestamp,
			nonceStr: nonce_str,
			signature: signature,
			ticket: ticket
		})
	})

	waterfall(steps, (err, data) => {
		if (err) {
			res.send({ status: 'error', data: err })
		} else {
			res.send({ status: 'success', data: data })
		}
	})
}


//暴露可供外部访问的接口
module.exports = WeChat;