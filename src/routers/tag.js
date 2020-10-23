const express = require('express')
const Tag = require('../models/tag')
const Bookmark = require('../models/bookmark')
const router = new express.Router()

router.post('/tag', async (req, res) => {
    const tags = req.body
    try {
        const tag = new Tag(tags)
        await tag.save();
        res.status(201).send(tag)
    } catch (e) {
        res.status(400).send(e)
    }
})
router.get('/tag', async (req, res) => {
    try {
        const tags = await Tag.find()
        res.status(200).send(tags)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/tag/:id', async (req, res) => {
    try {

        const bookmarks = await Bookmark.find()
        for (let i = 0; i < bookmarks.length; i++) {
            for (let j = 0; j < bookmarks[i].tags.length; j++) {
                if (bookmarks[i].tags[j].toString === req.params.id) {
                    bookmarks[i].tags.splice(j, 1)
                    bookmarks[i].timeUpdate = Date.now()
                    await bookmarks[i].save()
                    break
                }
            }
        }
        const tag = await Tag.findByIdAndDelete(req.params.id)
        if (!tag) {
            return res.status(404).send({
                error: 'tag not present'
            })
        }
        res.status(200).send(tag)
    } catch (e) {
        res.status(404).send(e)
    }
})

module.exports = router