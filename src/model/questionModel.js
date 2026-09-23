const mongoose = require('../db/mongodb')
const { Schema } = mongoose
const QuestionSchema = new Schema({
  questionName: {
    type: String,
    trim: true,
  },
  options: Array,
  rightAnswer: {
    type: String,
    trim: true
  },
  explain: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    trim: true
  },
  score: {
    type: Number,
    default: 0
  },
  subjectId: String,
}, { timestamps: true })

const Question = mongoose.model('Question', QuestionSchema, 'question')
module.exports = Question