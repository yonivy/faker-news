const Promise = require('bluebird')
const mongoose = require('mongoose')
const config = require('./config')

mongoose.Promise = Promise

module.exports = {
  connect: () => {    
    mongoose.connect(config.mongo.uri, {
      useMongoClient: true
    })

    return new Promise((resolve, reject) => {
      mongoose.connection.on('connected', resolve)
      mongoose.connection.on('error', reject)
    })
  },
  close: () => {
    return mongoose.connection.close()
  }
}
