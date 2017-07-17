const express = require('express')
const bodyParser = require('body-parser');
const mongo = require('./mongo')
const config = require('./config')
const routes = require('./routes')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

mongo.connect()
    .then(() => {
        console.log(`MongoDB connected`)
 
        routes(app) // load all routes

        app.listen(config.port, () => console.log(`Server listening on port ${config.port}`))
    })