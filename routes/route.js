const express = require('express')
const router = express.Router()
const routeModel = require('../src/model/routeModel')
// const mongoose = require('../src/db/mongodb')
const dayjs = require('dayjs')
const userModel = require('../src/model/userModel')
const roleModel = require('../src/model/roleModel')

// const getRoute = async (allData, parentId) => {
//   let result = null
//   for (let item of allData) {
//     if (item._id.toString() == parentId) {
//       // console.log(item._id.toString(), parentId, item._id.toString() == parentId)
//       result = item
//       break
//     }
//     else if (item.children.length > 0) {
//       // console.log(item.children)
//       result = await getRoute(item.children, parentId)
//     }
//   }
//   return result
// }

router.post('/add', async (req, res) => {
  const { routeName, name, path, component, parentId, _id, routeType } = req.body
  // 有父级id
  if (parentId) {
    if (_id) {
      // todo: 提示使用update接口
    }
    else {
      // const data = await routeModel.updateOne(
      //   { _id: parentId },
      //   { $push: { children: { _id: new mongoose.Types.ObjectId(), routeName, name, path, component, parentId, routeType } } },
      //   { upsert: true }
      // )
      // res.send({ code: 200, msg: '保存成功', data })

      // const allData = await routeModel.find()
      // const parentData = await getRoute(allData, parentId)
      // console.log(parentData)
      // if (parentData) {
      //   const { idPath } = parentData
      //   parentData.children.push({
      //     id: new mongoose.Types.ObjectId(),
      //     routeName,
      //     name,
      //     path, 
      //     component,
      //     parentId,
      //     routeType,
      //     idPath: `${idPath},${parentId}`
      //   })
      //   const data = await allData.save()
      //   res.send({ code: 200, msg: '保存成功', data })
      // }
      // else {
      //   res.send({ code: 500, msg: '父级路由不存在' })
      // }

      const parent = await routeModel.findById(parentId)
      if (parent) {
        // console.log('parent', parent)
        const { idPath: parent_idPath } = parent
        const data = await routeModel.create({
          routeName, name, path, component, parentId, routeType, idPath: `${parent_idPath},${parentId}`
        })
        return res.send({ code: 200, msg: '保存成功', data })
      }
      else {
        return res.send({ code: 500, msg: '父级路由不存在' })
      }
    }
  }
  else { // 无父级id
    const newRoute = new routeModel({ routeName, name, path, component, parentId: 'root', routeType, idPath: 'root' })
    const data = await newRoute.save()
    res.send({ code: 200, msg: '保存成功', data })
  }
})

router.post('/list', async (req, res) => {
  const result = await routeModel.find().lean()
  const map = new Map()
  result.forEach(item => {
    const { createdAt, updatedAt } = item
    map.set(item._id.toString(), { 
      ...item, 
      children: [],
      createTime: createdAt ? dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss') : '',
      updateTime: updatedAt ? dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss') : ''
    })
  })
  const tree = []
  result.forEach(item => {
    const node = map.get(item._id.toString())
    if (!item.parentId || item.parentId == 'root') {
      tree.push(node)
    }
    else {
      const parent = map.get(item.parentId)
      if (parent) parent.children.push(node)
      else tree.push(node)
    }
  })
  
  res.send({ code: 200, msg: '获取成功', data: tree })
})

/**
 * 更新单条数据
 * acknowledged: true 服务器已确认收到并执行了该写操作
 * matchedCount: 1 匹配查询条件的文档数量为 1
 * modifiedCount: 0 实际被修改的文档数量为 0（匹配到了文档，但更新内容与原有值相同，或更新未产生实际变化）
 * upsertedCount: 0 插入的新文档数量为 0
 * upsertedId: null 没有执行 upsert（插入新文档），因为已匹配到现有文档
*/
router.post('/updateOne', async (req, res) => {
  const { _id, routeName, name, path, component, parentId, routeType } = req.body
  
  // if (parentId == 'root') {
  //   const data = await routeModel.updateOne({ _id }, { routeName, name, path, component, routeType })
  //   res.send({ code: 200, msg: '保存成功', data })
  // }
  // else {
  //   routeModel.updateOne(
  //     { '_id': parentId, 'children._id': _id },
  //     { 
  //       $set: { 
  //         'children.$.routeName': routeName, 
  //         'children.$.name': name, 
  //         'children.$.path': path, 
  //         'children.$.component': component,
  //         'children.$.routeType': routeType
  //       }
  //     }
  //   ).then(data => {
  //     res.send({ code: 200, msg: '保存成功', data })
  //   }).catch(err => {
  //     console.log(err);
  //   })
  // }

  const { modifiedCount } = await routeModel.updateOne({ _id }, { routeName, name, path, component, routeType })
  if (modifiedCount > 0) {
    res.send({ code: 200, msg: '保存成功' })
  }
  else {
    res.send({ code: 500, msg: '保存失败' })
  }
})

router.post('/deleteOne', async (req, res, next) => {
  const { _id, parentId, routeName } = req.body
  // todo if _id
  // if (parentId == 'root') {
  //   const data = await routeModel.find({ _id })
    
  //   if (data.length > 0 && data[0].children.length > 0) {
  //     res.send({ code: 500, msg: '存在子路由' })
  //   }
  //   else {
  //     const data = await routeModel.deleteOne({ _id })
  //     res.send({ code: 200, msg: '删除成功', data })
  //   }
  // }
  // else {
  //   const { modifiedCount } = await routeModel.updateOne(
  //     { '_id': parentId },
  //     { $pull: { children: { _id } } }
  //   )
  //   .catch(err => {
  //     console.log(err)
  //   })
    
  //   if (modifiedCount > 0) {
  //     res.send({ code: 200, msg: '删除成功' })
  //   }
  //   else {
  //     res.send({ code: 500, msg: '删除失败' })
  //   }
  // }

  const regex = new RegExp(`(^|,)${_id}(,|$)`)
  const result = await routeModel.find({ idPath: { $regex: regex } })
  if (result.length > 0) {
    res.send({ code: 500, msg: '存在子路由' })
  }
  else {
    // acknowledged: true, deletedCount: 1
    const { deletedCount } = await routeModel.deleteOne({ _id })
    if (deletedCount > 0) res.send({ code: 200, msg: '删除成功' })
    else res.send({ code: 500, msg: 'not data' })
  }
})

/**
 * 
 */
router.post('/user', async (req, res) => {
  const { userId } = req.body
  // 查询用户
  const user = await userModel.findOne({ _id: userId }).lean()
  if (!user) return res.send({ code: 500, msg: '用户不存在' })
  else if (!user.roleIds || user.roleIds.length == 0) return res.send({ code: 200, msg: '用户未分配角色', data: user })
  // 查询 roles
  const roles = await roleModel.find({ _id: { $in: user.roleIds } }).lean()
  // 收集所有 role 的 routeIds 并去重
  let allRouteIds = []
  roles.forEach(role => {
    if (role.routeIds && role.routeIds.length > 0) {
      allRouteIds.push(...role.routeIds)
    }
    if (role.routeHalfIds && role.routeHalfIds.length > 0) {
      allRouteIds.push(...role.routeHalfIds)
    }
  })
  // 去重
  allRouteIds = [...new Set(allRouteIds)]
  if (allRouteIds.length == 0) return res.send({ code: 200, msg: '用户未分配路由', data: user })
  // 查询 routes
  const routes = await routeModel.find({ _id: { $in: allRouteIds } }).lean()
  res.send({ code: 200, msg: '获取成功', data: routes })
})

module.exports = router