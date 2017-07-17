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

router.patch('/:id', (req, res) => {
    const id = req.params.id
    const content = req.body.content

    posts.edit(id, content)
        .then((doc) => {
            res.status(200).json(doc)
        })
        .catch((err) => handleError(res, err, `Can't edit post ${id}`))
})

router.post('/:id/upvote', (req, res) => {
    const id = req.params.id

    posts.upvote(id)
        .then((doc) => {
            res.status(200).json(doc)
        })
        .catch((err) => handleError(res, err, `Can't upvote post ${id}`))
})

router.post('/:id/downvote', (req, res) => {
    const id = req.params.id

    posts.downvote(id)
        .then((doc) => {
            res.status(200).json(doc)
        })
        .catch((err) => handleError(res, err, `Can't downvote post ${id}`))
})

router.get('/top', (req, res) => {
  const { page, size } = req.query

    posts.top(page, size)
        .then((results) => {
            res.status(200).json({ results })
        })
        .catch((err) => handleError(res, err, `Can't get top posts`))
})

function handleError(res, err, msg) {
    const output = {
        status: err.statusCode || 500,
        message: msg
    }

    res.status(output.status).json(output)
}

module.exports = router
