const chai = require('chai')
const chaiAsPromised = require('chai-as-promised');
const Promise = require('bluebird')
const mongo = require('./mongo.test')
const model = require('../posts.model')

chai.use(chaiAsPromised)
chai.should()

describe('Posts Model', function () {
  this.timeout(0)

  before(() => mongo.connect())

  beforeEach(() => mongo.clear())

  after(() => mongo.close())

  describe('Create', () => {
    it('should create a new post provided text', () => {
      const text = `some non empty content`
      return model.create({ content: text })
        .then(post => {
          post.content.should.equal(text)
        })
    })

    it('should fail to create a new post provided empty text', () => {
      return Promise.all([
        model.create().should.be.rejectedWith(Error),
        model.create({ content: '' }).should.be.rejectedWith(Error),
        model.create({ content: '   ' }).should.be.rejectedWith(Error)
      ])
    })
  })

  describe('Edit', () => {
    it('should edit a post provided text', () => {
      return model.create({ content: 'test' })
        .then(post => {
          post.content.should.equal('test')

          return model.updateOne(post._id, { content: 'updated' })
        })
        .then(updated => {
          updated.content.should.equal('updated')
        })
    })

    it('should fail to edit a post provided empty text', () => {
      return model.create({ content: 'test' })
        .then(post => {
          const id  = post._id

          return Promise.all([
            makeAssertion(id),
            makeAssertion(id, { content: '' }),
            makeAssertion(id, { content: '   ' })
          ])

          function makeAssertion(id, content) {
            return model.updateOne(id, content).should.be.rejectedWith(Error)
          }
        })
    })
  })

  describe('Upvote', () => {
    it('should upvote an existing post', () => {
      return model.create({ content: 'text' })
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
      return model.create({ content: 'text' })
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

  describe('Top Posts', () => {
    it('should get a list of top posts', () => {
      return Promise.all([
        model.create({
          content: 'test-1',
          created_at: new Date(2017, 10, 10),
          upvotes: 30
        }),
        model.create({
          content: 'test-2',
          created_at: new Date(2016, 1, 1),
          upvotes: 50
        }),
        model.create({
          content: 'test-3',
          created_at: new Date(2017, 1, 1),
          upvotes: 10
        }),
        model.create({
          content: 'test-4',
          created_at: new Date(2016, 1, 1),
          upvotes: 2
        }),
        model.create({
          content: 'test-5',
          created_at: new Date(1980, 1, 1),
          upvotes: 1
        })
      ])
      .then(() => model.pageByScore(1, 3))
      .then((results) => {
        results[0].content.should.equal('test-1')
        results[1].content.should.equal('test-3')
        results[2].content.should.equal('test-2')
      })
    })
  })

})
