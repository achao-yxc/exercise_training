const mongoose = require('../db/mongodb')
const { Schema } = mongoose
const File = require('./fileModel')

const SubjectSchema = new Schema({
  subjectName: {
    type: String,
    trim: true,
  },
  fileList: [
    { type: Schema.Types.ObjectId, ref: 'File' }
  ],
  // fileId: String,
  // createTime: {
  //   type: Date,
  //   default: Date.now
  // },
  // updateTime: {
  //   type: Date,
  //   default: Date.now
  // }
}, { timestamps: true })

const Subject = mongoose.model('Subject', SubjectSchema, 'subject')
module.exports = Subject