const mongoose = require('../db/mongodb')
const { Schema } = mongoose
const FileSchema = new Schema({
  fileName: {
    type: String,
    trim: true
  },
  mimetype: String,
  size: Number,
  filePath: {
    type: String,
    trim: true
  },
}, { timestamps: true })

const File = mongoose.model('File', FileSchema, 'file')
module.exports = File