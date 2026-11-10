const mongoose = require('../db/mongodb')
const { Schema } = mongoose
const RoleSchema = new Schema({
  roleName: {
    type: String,
    trim: true,
  },
  routeIds: {
    // type: Schema.Types.ObjectId,
    // ref: 'Route'
    type: Array,
  },
}, { timestamps: true })

const Role = mongoose.model('Role', RoleSchema, 'role')
module.exports = Role