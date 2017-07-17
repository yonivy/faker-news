const model = require('./posts.model')

function create(content) {
  return model.create({ content })
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

function top(page, size) {
  return model.pageByScore(page, size)
}

module.exports = {
  create,
  edit,
  upvote,
  downvote,
  top
}
