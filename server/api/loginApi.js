const express = require('express');
const router = express.Router();
// const db = require('./connectDatabase')

router.post('/login', function (req, res) {
  for (const key in req.body) {
    const info = JSON.parse(key)
    const oldData = {
      username: 'mingge',
      pwd: '050236'
    }
    const exist_username = info.username === oldData.username
    const exist_pwd = info.pwd === oldData.pwd
    if (exist_username && exist_pwd) {
      res.json({
        code: 1
      })
    } else {
      res.statusCode = 500
      if (!exist_username) {
        res.json({
          code: 0,
          hint: '用户名错误！'
        })
      }
      if (!exist_pwd) {
        res.json({
          code: 0,
          hint: '密码错误！'
        })
      }
    }
    // db.query(`SELECT * FROM user`, [], (results) => {
    // })
  }
})