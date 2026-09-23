const express = require('express')
const router = express.Router()
const roleModel = require('../src/model/roleModel')

// 获取列表
router.post('/list', async (req, res, next) => {
  const allData = await roleModel.find({})
  const total = allData.length
  const { pageNo, pageSize, roleName } = req.body
  const skip = (pageNo - 1) * pageSize
  const data = await roleModel.find({ roleName: new RegExp(roleName, 'i') }).skip(skip).limit(pageSize)
  res.send({ code: 200, msg: '获取成功', data, total })
})

router.post('/add', async (req, res) => {
  const { roleName, routeIds } = req.body
  const newRole = new roleModel({ roleName, routeIds })
  const data = await newRole.save()
  res.send({ code: 200, msg: '保存成功', data })
})
// 详情
router.get('/detail', async (req, res, next) => {
  const { _id } = req.query
  const data = await roleModel.findOne({ _id })
  res.send({ code: 200, msg: '获取成功', data })
})
// 更新
router.post('/updateOne', async (req, res, next) => {
  const { _id, roleName, routeIds } = req.body
  const data = await roleModel.updateOne({ _id }, { roleName, routeIds })
  res.send({ code: 200, msg: '保存成功', data })
})
// 删除单条记录
router.post('/deleteOne', async (req, res, next) => {
  const { _id } = req.body
  const data = await roleModel.deleteOne({ _id })
  res.send({ code: 200, msg: '删除成功', data })
})
// 删除多条记录
router.post('/deleteMany', async (req, res, next) => {
  const { ids } = req.body
  const data = await roleModel.deleteMany({ _id: { $in: ids } })
  res.send({ code: 200, msg: '删除成功', data })
})

module.exports = router