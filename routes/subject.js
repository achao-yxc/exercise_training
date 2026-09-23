const express = require('express')
const router = express.Router()
const subjectModel = require('../src/model/subjectModel')

// 获取列表
router.post('/list', async (req, res, next) => {
  const { pageNo, pageSize, subjectName } = req.body
  const total = await subjectModel.countDocuments({ subjectName: new RegExp(subjectName, 'i') })
  const skip = (pageNo - 1) * pageSize
  const result = await subjectModel.find({ subjectName: new RegExp(subjectName, 'i') }).populate('fileList').skip(skip).limit(pageSize)
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
// 添加
router.post('/add', async (req, res) => {
  const { subjectName, fileList } = req.body
  const newSubject = new subjectModel({ subjectName, fileList })
  const data = await newSubject.save()
  res.send({ code: 200, msg: '保存成功', data })
})
// 详情
router.get('/detail', async (req, res, next) => {
  const { _id } = req.query
  const data = await subjectModel.findOne({ _id }).populate('fileList')
  res.send({ code: 200, msg: '获取成功', data })
})
// 更新
router.post('/updateOne', async (req, res, next) => {
  console.log('subject updateOne', req.body);
  const { _id, subjectName, fileList } = req.body
  // const data = await subjectModel.updateOne({ _id }, { subjectName, $push: { fileList } })
  // const data = await subjectModel.updateOne(
  //   { _id },
  //   { $set: { subjectName, 'fileList.$.fileName': fileList[0].fileName, fileId, updateTime: Date.now() } },
  //   { upsert: true }
  // )
  const data = await subjectModel.findOneAndUpdate(
    { _id },
    { subjectName, fileList },
    { new: true }
  ).populate('fileList')
  res.send({ code: 200, msg: '保存成功', data })
})
// 删除单条记录
router.post('/deleteOne', async (req, res, next) => {
  const { _id } = req.body
  const data = await subjectModel.deleteOne({ _id })
  res.send({ code: 200, msg: '删除成功', data })
})
// 删除多条记录
router.post('/deleteMany', async (req, res, next) => {
  const { ids } = req.body
  const data = await subjectModel.deleteMany({ _id: { $in: ids } })
  res.send({ code: 200, msg: '删除成功', data })
})

const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const { fieldname, originalname, encoding, mimetype } = file
    file.originalname = Buffer.from(originalname, 'latin1').toString('utf-8')
    cb(null, Date.now() + '-' + file.originalname)
  }
})
const upload = multer({ storage })

const fileModel = require('../src/model/fileModel')

router.post('/upload', upload.single('file'),  async (req, res) => {
  const { originalname, mimetype, size, path } = req.file
  const newFile = new fileModel({ fileName: originalname, mimetype, size, filePath: path })
  const { _id, createTime, __v } = await newFile.save()
  res.send({ code: 200, msg: '保存成功', data: { _id, createTime, __v, name: originalname, size, type: mimetype, filePath: path } })
})



module.exports = router