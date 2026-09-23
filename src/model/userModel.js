const mongoose = require('../db/mongodb')
// const bcrypt = require('bcrypt')
// // 建立用户表
// const UserSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     unique: true，// 唯一索引
//     index: true, // 普通索引
//     required: true, // 必填
//     max: 100, // Number类型最大值
//     min: 0, // Number类型最小值
//     enum: [0,1,2,3], // 枚举值
//     maxlength: 20, // 长度最大值
//     minlength: 20, // 长度最小值
//     match: /.*/, // 正则
//     validate: (val) => {}, // 自定义
//   },
//   password: {
//     type: String,
//     set(val) { // 新增数据时，对值进行处理
//       return bcrypt.hashSync(val, 10)
//     },
//     select: false
//   },
//   createTime: {
//     type: Date,
//     default: Date.now
//   },
//   updateTime: {
//     type: Date,
//     default: Date.now
//   }
// })

// 定义数据集合映射，每个schema会映射到mongodb的一个collection，不具备操作数据库的能力
const UserSchema = mongoose.Schema({
  username: {
    type: String,
    trim: true, // 去除左右空格
  },
  password: {
    type: String,
    default: '123',
    trim: true,
  },
  age: {
    type: Number,
    default: 0
  },
  gender: {
    type: String,
    // enum: ['男', '女', '未知'],
    default: '2' // 0男，1女，2未知
  },
  status: {
    type: Number,
    default: 1
  },
  roleIds: {
    type: Array,
  },
  // createTime: {
  //   type: Date,
  //   default: Date.now
  // },
  // updateTime: {
  //   type: Date,
  //   default: Date.now
  // }
}, { timestamps: true })
// 静态方法
// UserSchema.statics.findByUid = (uid, callback) => {
//   this.find({"_id": uid}, (err, docs) => {
//     callback(err, docs)
//   })
// }
// 实例方法
// UserSchema.methods.print = () => {
//   console.log(this)
// }

// 定义数据库模型，操作数据库
// 参数1，模型名称，首字母大写，User对应数据库集合users
// 参数2，Schema对象
// 参数3，数据库集合名称，默认为模型名称的小写复数形式
// mongoose.model('User', UserSchema, 'user')
const User = mongoose.model('User', UserSchema)

module.exports = User
