const model = require('./posts.model')

function create(content) {
  return model.create(content)
}

function edit(id, content) {
  return model.updateOne(id, { content })
}


module.exports = {
  create,
  edit
}
