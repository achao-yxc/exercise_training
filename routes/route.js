const express = require('express')
const router = express.Router()
const Route = require('../src/model/routeModel')

router.post('/add', async (req, res) => {
  const { routeName, name, path, component, parentId, _id, routeType } = req.body
  if (parentId) {
    // const result = await Route.find({ _id: parentId })
    // if (data.length > 0) {
    //   data[0].children.push({ _id: new ObjectId(), routeName, path, component, parentId })
    //   const result = await Route.updateOne({ _id: parentId }, { children: data[0].children })
    //   res.send({ code: 200, msg: '保存成功', data: result })
    // }
    // const childrenLen = result[0].children.length
    // const data = Route.updateOne(
    //   { _id: parentId },
    //   // { $set: { ['children.'+childrenLen]: { routeName, path, component, parentId } } },
    //   { $push: { children: { routeName, path, component, parentId } } },
    //   { upsert: true }
    // )
    console.log(_id);
    
    if (_id) {
      // const data = await Route.updateOne(
      //   { _id: parentId, 'children._id': _id },
      //   { $set: { 'children.$.routeName': routeName, 'children.$.path': path, 'children.$.component': component } }
      // )
      // res.send({ code: 200, msg: '保存成功', data })
    }
    else {
      const data = await Route.updateOne(
        { _id: parentId },
        { $push: { children: { routeName, name, path, component, parentId, routeType } } },
        { upsert: true }
      )
      res.send({ code: 200, msg: '保存成功', data })
    }
  }
  else {
    const newRoute = new Route({ routeName, name, path, component, parentId: 'root', routeType })
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
    const data = await Route.updateOne(
      { '_id': parentId },
      { $pull: { children: { _id } } }
    )
    res.send({ code: 200, msg: '删除成功', data })
  }
})

module.exports = router