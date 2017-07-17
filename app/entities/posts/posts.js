const model = require('./posts.model')

function create(content) {
  return model.create(content)
}

module.exports = {
  create
}