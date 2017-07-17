const Promise = require('bluebird')
const mongoose = require('mongoose')
const schema = require('./posts.schema')

const Model = mongoose.model('Post', schema)

function create(opts) {
  if(!opts) {
    return Promise.reject(new Error('No options object was provided'))
  }

  return Model.create({
      content: opts.content,
      created_at: opts.created_at,
      upvotes: opts.upvotes,
      downvotes: opts.downvotes
    })
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

function incrementOne(id, field) {
  const update = { $inc: {} }
  update.$inc[field] = 1

  return updateOne(id, update)
}

function pageByScore(page, size) {
  page = page && page > 0 ? page : 1
  size = size && size > 0 ? size : 30

  const unixStart = new Date('1970-01-01T00:00:00Z')
  const docsToSkip = (page - 1) * size

  return Model.aggregate()
    .project({
      score: {
        $let: {
           vars: {
              timeScore: { $multiply: [ { $subtract: [ '$created_at', unixStart ] }, 0.7 ] },
              upvotesScore: { $multiply: [ "$upvotes", 0.3 ] }
           },
           in: { $add: [ "$$upvotesScore", "$$timeScore" ] }
        }
      },
      content: 1,
      upvotes: 1,
      downvotes: 1,
      created_at: 1
    })
    .sort({ score : 'desc' })
    .limit(size)
    .skip(docsToSkip)
    .exec()
}

module.exports = {
  create,
  updateOne,
  incrementOne,
  pageByScore
}
