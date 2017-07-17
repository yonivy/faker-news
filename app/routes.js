const posts = require('./entities/posts/posts.ctrl')

module.exports = (app) => {
    app.use('/posts', posts)

    app.use(function (err, req, res, next) {
        const msg = `Something failed somewhere...`

        console.error(msg, err)

        if (res.headersSent) {
            return next(err)
        }

        res.status(500).send({ error: msg })
    })
}