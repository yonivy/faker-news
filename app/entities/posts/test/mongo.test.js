const mongoose = require('mongoose')
const mongo = require('../../../mongo')

module.exports = Object.assign({}, mongo, {
  clear: () => mongoose.connection.db.dropDatabase()
})
