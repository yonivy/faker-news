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

  it('should create a new post provided text', () => {
    return model.create('some non empty content')
  })

  it('should fail to create a new post provided empty text', () => {
    return Promise.all([
      model.create().should.be.rejectedWith(Error),
      model.create('').should.be.rejectedWith(Error),
      model.create('   ').should.be.rejectedWith(Error)
    ])
  })
})
