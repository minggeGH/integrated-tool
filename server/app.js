const express = require('express');
const app = express()
const hostname = '0.0.0.0';
const port = 1314;

const bodyParser = require('body-parser');
const toolApi = require("./api/toolApi.js")
// const cors = require('cors');
// origin 可配置多个域名白名单（数组），也可配置一项域名（字符串）

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next()
});

// 传参json解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(toolApi)

app.listen(port, hostname);