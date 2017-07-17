const Promise = require('bluebird')
const mongoose = require('mongoose')
const schema = require('./posts.schema')

const Model = mongoose.model('Post', schema)

function create(content, cb) {
  return Model.create({ content: content })
    .then(doc => doc.toObject())
}

function updateOne(id, operation) {
  const options = {
    new: true,
    runValidators: true
  }

  if (!operation) {
    return Promise.reject(new Error(`No update operation was provided`))
  }

  return Model.findByIdAndUpdate(id, operation, options).lean()
}

module.exports = {
  create,
  updateOne
}
