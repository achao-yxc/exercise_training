const express = require('express')
const router = express.Router()
const fileModel = require('../src/model/fileModel')
const fs = require('fs')
const dayjs = require('dayjs')
// const mime = require('mime-types')

const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    // console.log('req', req);
    // console.log('file', file);
    // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
    const { fieldname, originalname, encoding, mimetype } = file
    file.originalname = Buffer.from(originalname, 'latin1').toString('utf-8')
    cb(null, Date.now() + '-' + file.originalname)
  }
})
const upload = multer({ storage })

router.post('/upload', upload.single('file'),  async (req, res) => {
  // console.log(req.file);
  // console.log(res.req.file);
  
  // no such file or directory, open 'D:\node_project\exercise_training\uploads\1778316735787-undefined'
  const { originalname, mimetype, size, path } = req.file
  const newFile = new fileModel({ fileName: originalname, mimetype, size, filePath: path })
  const { _id, __v } = await newFile.save()
  res.send({ code: 200, msg: '保存成功', data: { _id, __v, name: originalname, size, type: mimetype, filePath: path } })
})

router.post('/list', async (req, res) => {
  const result = await fileModel.find({})
  const data = result.map(item => {
    const newItem = item.toObject()
    const { createdAt, updatedAt } = newItem
    return {
      ...newItem,
      createTime: createdAt ? dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss') : '',
      updateTime: updatedAt ? dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss') : ''
    }
  })
  res.send({ code: 200, msg: '获取成功', data })
})
// 删除单条记录
router.post('/deleteOne', async (req, res, next) => {
  const { _id } = req.body
  const data = await fileModel.deleteOne({ _id })
  res.send({ code: 200, msg: '删除成功', data })
})
// 下载文件
router.get('/fileStream', async (req, res) => {
  const { _id } = req.query
  const result = await fileModel.find({ _id })
  const { fileName, filePath } = result[0]
  res.download(`${__dirname.split('routes')[0]}${filePath}`, fileName)
})
// 下载文件，手动设置响应头
const path = require('path')
router.get('/fileStreamManual', async (req, res) => {
  const { _id } = req.query
  const result = await fileModel.find({ _id })
  const { fileName, filePath } = result[0]

  // const FilePath = 'D:\\node_project\\exercise_training\\uploads\\1779372979028-交通费报销明细.xlsx'
  // const FilePath = `${__dirname.split('routes')[0]}${filePath}`
  // console.log('filePath', FilePath)
  const fileStream = fs.createReadStream(`${__dirname.split('routes')[0]}${filePath}`)
  res.setHeader('Content-disposition', `attachment; filename=${encodeURIComponent(fileName)}`)
  // res.setHeader('Content-type', 'application/octet-stream')
  fileStream.pipe(res)
})

module.exports = router