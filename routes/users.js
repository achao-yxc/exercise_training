var express = require('express');
var router = express.Router();
const userModel = require('../src/model/userModel')
const dayjs = require('dayjs')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 用户登录
router.post('/login', async (req, res) => {
  const { username, password } = req.body
  const result = await userModel.find({ 'username': username, 'password': password })
  if (result.length > 0) {
    res.send({ code: 200, msg: '登录成功', data: result[0] })
  }
  else {
    res.send({ code: 500, msg: '登录失败，请检查账号密码', data: null })
  }
})

// 用户注册
// router.post('/register', async (req, res, next) => {
//   const user = await User.create({
//     username: req.body.username,
//     password: req.body.password
//   })
//   res.send(user)
// })

// 获取用户列表
router.post('/list', async (req, res, next) => {
  // await User.find({}, (err, doc) => {
  //   if (err) {
  //     console.log(err)
  //     return
  //   }
  //   else {
  //     console.log(doc);
  //   }
  // })

  // 自定义静态方法
  // User.findByUid('xxxx')
  const { username, pageNo, pageSize } = req.body
  const total = await userModel.countDocuments({
    username: new RegExp(username, 'i')
  })
  const skip = (pageNo - 1) * pageSize
  const result = await userModel.find({ username: new RegExp(username, 'i') }).skip(skip).limit(pageSize)
  const data = result.map(item => {
    const newItem = item.toObject()
    const { createdAt, updatedAt } = newItem
    return {
      ...newItem,
      createTime: createdAt ? dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss') : '',
      updateTime: updatedAt ? dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss') : ''
    }
  })
  res.send({ code: 200, msg: '获取成功', data, total })
})
// 新增
router.post('/add', async (req, res, next) => {
  const { username, age, status, gender, roleIds } = req.body

  const newuser = new userModel({
    username, age, status, gender, roleIds
  })
  const data = await newuser.save()
  res.send({ code: 200, msg: '保存成功', data })
  // 自定义实例方法
  // newuser.print()
})
// 更新
router.post('/updateOne', async (req, res, next) => {
  const { _id, username, age, status, gender, roleIds } = req.body
  const data = await userModel.updateOne({ _id }, { username, age, status, gender, roleIds })
  res.send({ code: 200, msg: '保存成功', data })
})
// 删除单条记录
router.post('/deleteOne', async (req, res, next) => {
  const { _id } = req.body
  const data = await userModel.deleteOne({ _id })
  res.send({ code: 200, msg: '删除成功', data })
})
// 删除多条记录
router.post('/deleteMany', async (req, res, next) => {
  const { ids } = req.body
  const data = await userModel.deleteMany({ _id: { $in: ids } })
  res.send({ code: 200, msg: '删除成功', data })
})

// 详情
router.get('/detail', async (req, res, next) => {
  const { _id } = req.query
  const data = await userModel.findOne({ _id })
  res.send({ code: 200, msg: '获取成功', data })
})

// const OrderModel = require('...')
// 表关联
// OrderModel.aggregate([
//   {
//     $lookup: {
//       from: 'order_item',
//       localField: 'order_id',
//       foreignField: 'order_id',
//       as: 'items'
//     }
//   },
//   {
//     $match: {
//       all_price: {$gte: 90}
//     }
//   }
// ])

// const OrderItemModel = require('...')
// 根据子表id查询数据，获取主表id，根据主表id查询数据 function1
// const result = OrderItemModel.find({"_id": "000"})
// const order_id = result[0].order_id
// const result2 = OrderModel.find({"order_id": order_id})
// result[0].order_info = result2[0]

// function2
// const mongoose = require('mongoose')
// OrderModel.aggregate([
//   {
//     $lookup: {
//       from: 'order',
//       localField: 'order_id',
//       foreignField: 'order_id',
//       as: 'order_info'
//     }
//   },
//   {
//     $match: {
//       _id: mongoose.Types.ObjectId("000")
//     }
//   }
// ])

module.exports = router