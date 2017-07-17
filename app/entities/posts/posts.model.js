const Promise = require('bluebird')
const mongoose = require('mongoose')
const schema = require('./posts.schema')

const Model = mongoose.model('Post', schema)

function create(content, cb) {
  return Model.create({ content: content })
    .then(doc => doc.toObject())
}

module.exports = {
  create
}
