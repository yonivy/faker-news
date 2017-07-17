const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, `Post's content is required and cannot be empty`],
    validate: /\S+/
  },
  upvotes: {
    type: Number,
    min: 0,
    default: 0
  },
  downvotes: {
    type: Number,
    min: 0,
    default: 0
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

module.exports = schema
