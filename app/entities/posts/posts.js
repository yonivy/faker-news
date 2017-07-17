const model = require('./posts.model')

function create(content) {
  return model.create(content)
}

function edit(id, content) {
  return model.updateOne(id, { content })
}

function upvote(id) {
  return model.incrementOne(id, 'upvotes')
}

function downvote(id) {
  return model.incrementOne(id, 'downvotes')
}

module.exports = {
  create,
  edit,
  upvote,
  downvote
}
