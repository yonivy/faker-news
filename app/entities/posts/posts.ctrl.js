const router = require('express').Router()
const posts = require('./posts')

router.post('/', (req, res) => {
    const content = req.body.content

    posts.create(content)
        .then((doc) => {
            res.status(201).json(doc)
        })
        .catch((err) => handleError(res, err, `Can't create post`))
})

function handleError(res, err, msg) {
    const output = {
        status: err.statusCode || 500,
        message: msg
    }

    res.status(output.status).json(output)
}

module.exports = router