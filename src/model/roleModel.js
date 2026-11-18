const mongoose = require('../db/mongodb')
const { Schema } = mongoose
const RoleSchema = new Schema({
  roleName: {
    type: String,
    trim: true,
  },
  routeIds: {
    type: Array,
  },
  routeHalfIds: { type: Array },
}, { timestamps: true })

const Role = mongoose.model('Role', RoleSchema, 'role')
module.exports = Role