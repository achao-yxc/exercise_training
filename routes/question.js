const express = require('express')
const router = express.Router()
const questionModel = require('../src/model/questionModel')
const dayjs = require('dayjs')
const subjectModel = require('../src/model/subjectModel')

// 获取列表
router.post('/list', async (req, res, next) => {
  const { pageNo, pageSize, questionName, subjectId } = req.body
  const total = await questionModel.countDocuments({
    questionName: new RegExp(questionName, 'i'), 
    subjectId: new RegExp(subjectId, 'i') 
  })
  const skip = (pageNo - 1) * pageSize
  const result = await questionModel.find({
    questionName: new RegExp(questionName, 'i'), 
    subjectId: new RegExp(subjectId, 'i') 
  })
  .skip(skip)
  .limit(pageSize)
  
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
router.post('/add', async (req, res) => {
  const { questionName, options, rightAnswer, explain, type, score, subjectId } = req.body
  const newQuestion = new questionModel({ questionName, options, rightAnswer, explain, type, score, subjectId })
  const data = await newQuestion.save()
  res.send({ code: 200, msg: '保存成功', data })
})
// 详情
router.get('/detail', async (req, res, next) => {
  const { _id } = req.query
  const data = await questionModel.findOne({ _id })
  res.send({ code: 200, msg: '获取成功', data })
})
// 更新
router.post('/updateOne', async (req, res, next) => {
  const { _id, questionName, options, rightAnswer, explain, type, score, subjectId } = req.body
  const data = await questionModel.updateOne({ _id }, { questionName, options, rightAnswer, explain, type, score, subjectId })
  res.send({ code: 200, msg: '保存成功', data })
})
// 删除单条记录
router.post('/deleteOne', async (req, res, next) => {
  const { _id } = req.body
  const data = await questionModel.deleteOne({ _id })
  res.send({ code: 200, msg: '删除成功', data })
})
// 删除多条记录
router.post('/deleteMany', async (req, res, next) => {
  const { ids } = req.body
  const data = await questionModel.deleteMany({ _id: { $in: ids } })
  res.send({ code: 200, msg: '删除成功', data })
})

const fs = require('fs')
const xlsx = require('node-xlsx')

router.post('/import', async (req, res) => {
  try {
    const { filePath } = req.body
    // 'uploads\\2026试题模板.xlsx'
    const dataByParse = xlsx.parse(fs.readFileSync('uploads\\1782782447303-2026试题模板.xlsx'))
    // 获取所有科目数据
    const subjectData = await subjectModel.find()
    let sheets = []
    for (const [index, sheet] of dataByParse[0].data.entries()) {
      // console.log(index, sheet)
      if (index > 0) {
        // todo: 判断题型
        let options = []
        sheet[1].split('\n').forEach(item => {
          options.push({value: item.split('.')[0], text: item.split('.')[1]})
        })
        const subjectId = subjectData.find(item => item.subjectName === sheet[6])?._id
        sheets.push({
          questionName: sheet[0],
          options,
          rightAnswer: sheet[2],
          explain: sheet[3],
          type: sheet[4],
          score: sheet[5],
          subjectId
        })
      }
    }
    // console.log('sheets', sheets);
    const data = await questionModel.insertMany(sheets)
    res.send({ code: 200, msg: '导入成功', data })
  } catch (error) {
    console.log('error', error);
    res.send({ code: 500, msg: '导入失败', data: error })
  }
})

module.exports = router