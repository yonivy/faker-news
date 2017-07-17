const chai = require('chai')
const chaiAsPromised = require('chai-as-promised');
const Promise = require('bluebird')
const mongo = require('../../../mongo')
const model = require('../posts.model')

chai.use(chaiAsPromised)
chai.should()

describe('Posts Model', function () {
  this.timeout(0)

  before(() => {
    return mongo.connect()
  })

  after(() => mongo.close())

  describe('Create', () => {
    it('should create a new post provided text', () => {
      const text = `some non empty content`
      return model.create(text)
        .then(post => {
          post.content.should.equal(text)
        })
    })

    it('should fail to create a new post provided empty text', () => {
      return Promise.all([
        model.create().should.be.rejectedWith(Error),
        model.create('').should.be.rejectedWith(Error),
        model.create('   ').should.be.rejectedWith(Error)
      ])
    })
  })

  describe('Edit', () => {
    it('should edit a post provided text', () => {
      return model.create('test')
        .then(post => {
          post.content.should.equal('test')

          return model.updateOne(post._id, { content: 'updated' })
        })
        .then(updated => {
          updated.content.should.equal('updated')
        })
    })

    it('should fail to edit a post provided empty text', () => {
      return model.create('test')
        .then(post => {
          const id  = post._id

          return Promise.all([
            makeAssertion(id),
            makeAssertion(id, { content: ''}),
            makeAssertion(id, { content: '   '})
          ])

          function makeAssertion(id, content) {
            return model.updateOne(id, content).should.be.rejectedWith(Error)
          }
        })
    })
  })

  describe('Upvote', () => {
    it('should upvote an existing post', () => {
      return model.create('text')
        .then(post => {
          post.upvotes.should.equal(0)

          return model.incrementOne(post._id, 'upvotes')
        })
        .then(post => {
          post.upvotes.should.equal(1)
        })
    })

    it('should fail to upvote a non existing post', () => {
      return model.incrementOne('somehash', 'upvotes').should.be.rejectedWith(Error)
    })
  })

  describe('Downvote', () => {
    it('should upvote an existing post', () => {
      return model.create('text')
        .then(post => {
          post.downvotes.should.equal(0)

          return model.incrementOne(post._id, 'downvotes')
        })
        .then(post => {
          post.downvotes.should.equal(1)
        })
    })

    it('should fail to upvote a non existing post', () => {
      return model.incrementOne('somehash', 'downvotes').should.be.rejectedWith(Error)
    })
  })
})
