const express = require('express')
const router = express.Router()
const Route = require('../src/model/routeModel')
const mongoose = require('../src/db/mongodb')

router.post('/add', async (req, res) => {
  const { routeName, name, path, component, parentId, _id, routeType } = req.body
  // 有父级id
  if (parentId) {
    if (_id) {
      // todo: 提示update接口
    }
    else {
      // const data = await Route.updateOne(
      //   { _id: parentId },
      //   { $push: { children: { _id: new mongoose.Types.ObjectId(), routeName, name, path, component, parentId, routeType } } },
      //   { upsert: true }
      // )
      // res.send({ code: 200, msg: '保存成功', data })

      const parentData = await Route.findById(parentId)
      console.log(parentData)
      if (parentData) {
        const { idPath } = parentData
        parentData.children.push({
          id: new mongoose.Types.ObjectId(),
          routeName,
          name,
          path, 
          component,
          parentId,
          routeType,
          idPath: `${idPath},${parentId}`
        })
        const data = await parentData.save()
        res.send({ code: 200, msg: '保存成功', data })
      }
      else {
        res.send({ code: 500, msg: '父级路由不存在' })
      }
    }
  }
  else { // 无父级id
    const newRoute = new Route({ routeName, name, path, component, parentId: 'root', routeType, idPath: 'root' })
    const data = await newRoute.save()
    res.send({ code: 200, msg: '保存成功', data })
  }
})

router.post('/list', async (req, res) => {
  const data = await Route.find()
  res.send({ code: 200, msg: '获取成功', data })
})

router.post('/updateOne', async (req, res) => {
  const { _id, routeName, name, path, component, parentId, routeType } = req.body
  
  if (parentId == 'root') {
    const data = await Route.updateOne({ _id }, { routeName, name, path, component, routeType })
    res.send({ code: 200, msg: '保存成功', data })
  }
  else {
    // const data = await Route.find({ _id: parentId })
    // for (let item of data[0].children) {
    //   console.log(item, _id);
      
    //   if (item._id.toString() === _id) {
    //     item.routeName = routeName
    //     item.path = path
    //     item.component = component
    //     const data2 = await Route.updateOne({ _id: parentId }, { children: data[0].children })
    //     // const data2 = await Route.updateOne({ _id }, { routeName, path, component })
    //     // res.send({ code: 200, msg: '保存成功', data: data2 })
    //   }
    // }

    Route.updateOne(
      { '_id': parentId, 'children._id': _id },
      { 
        $set: { 
          'children.$.routeName': routeName, 
          'children.$.name': name, 
          'children.$.path': path, 
          'children.$.component': component,
          'children.$.routeType': routeType
        }
      }
    ).then(data => {
      res.send({ code: 200, msg: '保存成功', data })
    }).catch(err => {
      console.log(err);
    })
  }
})

router.post('/deleteOne', async (req, res, next) => {
  const { _id, parentId, routeName } = req.body
  // todo if _id
  if (parentId == 'root') {
    const data = await Route.find({ _id })
    
    if (data.length > 0 && data[0].children.length > 0) {
      res.send({ code: 500, msg: '存在子路由' })
    }
    else {
      const data = await Route.deleteOne({ _id })
      res.send({ code: 200, msg: '删除成功', data })
    }
  }
  else {
    /* 
    * acknowledged: true 服务器已确认收到并执行了该写操作
    * matchedCount: 1 匹配查询条件的文档数量为 1
    * modifiedCount: 0 实际被修改的文档数量为 0（匹配到了文档，但更新内容与原有值相同，或更新未产生实际变化）
    * upsertedCount: 0 插入的新文档数量为 0
    * upsertedId: null 没有执行 upsert（插入新文档），因为已匹配到现有文档
     */
    // console.log('routeName', routeName)
    const { modifiedCount } = await Route.updateOne(
      { '_id': parentId },
      { $pull: { children: { _id } } }
    )
    .catch(err => {
      console.log(err)
    })
    
    if (modifiedCount > 0) {
      res.send({ code: 200, msg: '删除成功' })
    }
    else {
      res.send({ code: 500, msg: '删除失败' })
    }
  }
})

module.exports = router