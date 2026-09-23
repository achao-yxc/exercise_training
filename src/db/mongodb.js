// 引入mongoose并连接数据库
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/exercise',{
  // useNewUrlParser: true,
  // useCreateIndex: true,
  // useUnifiedTopology: true,
  // useFindAndModify: false
})

module.exports = mongoose

/**
 * 数据库操作命令
 * 
 * 查看数据库
 * show dbs
 * 
 * 创建、使用数据库
 * use 数据库名
 * 
 * 查看集合
 * show collections
 * 
 * 查看集合数据
 * 所有数据 db.xx.find()
 * 查询age=22 db.xx.find({"age": 22})
 * age > 22 db.xx.find({"age": {$gt: 22}})
 * age < 22 db.xx.find({"age": {$lt: 22}})
 * age >= 22 db.xx.find({"age": {$gte: 22}})
 * age <= 22 db.xx.find({"age": {$lte: 22}})
 * age >= 22 && age <= 30 db.xx.find({"age": {$gte: 22, $lte: 30}})
 * 模糊查询 db.xx.find({"name": /mongo/})
 * 以mongo开头 db.xx.find({"name": /^mongo/})
 * 以mongo结尾 db.xx.find({"name": /mongo$/})
 * 查询指定列 db.xx.find({}, {name: 1, age: 1})
 * 排序 升序 db.xx.find().sort({age: 1})
 * 排序 降序 db.xx.find().sort({age: -1})
 * 查询前5条数据 db.xx.find().limit(5)
 * 跳过前3条，查询第4-6条数据 db.xx.find().skip(3).limit(3)
 * 
 * 新增数据
 * db.xx.insert({"label": "value"})
 * 
 * 删除集合中数据
 * db.user.remove()
 * 
 * 删除集合
 * db.user.drop()
 * 
 * 删除数据库
 * db.dropDatabase()
 * 
 * db.user.getIndexes()
 * 
 * $project 将集合中的文档进行投影，指定返回的字段
 * $match 将集合中的文档进行过滤，指定查询条件 
 * $group 将集合中的文档进行分组，可用于统计结果
 * 统计每个订单的订单数量，按照订单号order_id分组，统计num字段的总和
 * db.order_item.aggregate([
 *   {
 *     $group: {  _id: "$order_id", total: { $sum: "$num" } }
 *   }
 * ])
 * 统计每个订单的订单数量，按照订单号order_id分组，统计price字段的总和
 * db.order_item.aggregate([
 *   {
 *     $group: { _id: "$order_id", total: { $sum: "$price" } }
 *   }
 * ])
 * 
 * $sort 将集合中的文档进行排序
 * 升序排序
 * db.order.aggregate([
 *   { $project: { trade_no: 1, price: 1 } },
 *   { $match: { price: { $gte: 100 } } },
 *   { $sort: { price: 1 } }
 * ])
 * 
 * $limit 限制返回的文档数量
 * 返回5条数据
 * db.order.aggregate([
 *   { $project: { trade_no: 1, price: 1 } }, 
 *   { $limit: 5 }
 * ])
 * 
 * $skip 跳过指定数量的文档
 * 跳过前5条数据
 * db.order.aggregate([
 *   { $project: { trade_no: 1, price: 1 } }, 
 *   { $skip: 5 }
 * ])
 * 
 * $lookup 连接两个集合
 * from: 连接的集合名称
 * localField: 当前集合中的字段
 * foreignField: 连接集合中的字段
 * as: 连接结果的别名
 * db.order.aggregate([
 *   {
 *     $lookup: {
 *       from: "order_item",
 *       localField: "trade_no",
 *       foreignField: "order_id",
 *       as: "items"
 *     }
 *   }
 * ])
 */