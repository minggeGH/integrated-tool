// todo 工具接口 - 操作JSON

const express = require('express');

const fs = require("fs");
// const app = express()
const router = express.Router();
const jsonUrl = './server/json/tool/keepAccounts.json'
// 获取json数据
// call: 查询结果 key: 获取json数据中的对象key
function getJson(call, key) {
  fs.readFile(jsonUrl, 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return
    } else {
      call(JSON.parse(data)[key], newData => {
        const info = JSON.parse(data)
        info[key] = newData
        fs.writeFileSync(jsonUrl, JSON.stringify(info));
      })
    }
  })
}

// 获取文章数据
router.get('/toolServe', function (req, res) {
  getJson((data) => {
    res.send(data);
  }, 'data')
})
// 新增文章数据
router.post('/toolServe/add', function (req, res) {
  getJson((data, to) => {
    let newData = []
    newData = data
    for (const key in req.body) {
      const info = JSON.parse(key)
      const b = new Buffer.from((Math.round(Math.random() * 100000000000000)).toString())
      info.id = b.toString('base64').substring(0, b.toString('base64').length - 1)
      info.state = 1
      newData.push(info)
      to(newData)
      res.send(key)
    }
  }, 'data')

})
// 编辑文章数据
router.post('/toolServe/edit', function (req, res) {
  console.log("🚀 ~ req, res:", req, res)
  getJson((data, to) => {
    let newData = []
    newData = data
    for (const key in req.body) {
      newData[key] = req.body[key]
    }
    to(newData)
    res.send(newData)
  }, 'data')
})
// 删除文章数据
router.post('/toolServe/delete', function (req, res) {
  getJson((data, to) => {
    let newData = []
    newData = data
    for (const key in req.body) {
      const info = JSON.parse(key)
      newData.splice(info.index, 1)
      to(newData)
      res.send(key)
    }
  }, 'data')
})

module.exports = router