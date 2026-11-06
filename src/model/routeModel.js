const mongoose = require('../db/mongodb')
const { Schema } = mongoose

const RouteSchema = new Schema({
  routeName: {
    type: String,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
  },
  path: {
    type: String,
    trim: true,
  },
  component: {
    type: String,
    trim: true,
  },
  parentId: {
    type: String,
  },
  routeType: {
    type: String,
  },
  idPath: {
    type: String,
  },
}, { timestamps: true })

// RouteSchema.add({
//   children: [RouteSchema]
// })

const Route = mongoose.model('Route', RouteSchema, 'route')

module.exports = Route