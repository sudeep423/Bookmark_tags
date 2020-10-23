const express = require('express')
const { set } = require('mongoose')
const Bookmark = require('../models/bookmark')
const Tag = require('../models/tag')
const router = new express.Router()



router.post('/bookmark', async (req, res) => {

    try {
        const bm = await Bookmark.findOne({ link: req.body.link })
        if (bm) {
            return res.status(400).send({
                error: "link already bookmarked"
            })
        }
        const bookmarks = req.body
        let bookmarkTag = bookmarks.tag.filter(function (v, i, self) {
            return i == self.indexOf(v);
        })
        let tag = undefined
        let tags = []
        for (let i = 0; i < bookmarkTag.length; i++) {
            tag = await Tag.findOne({ title: bookmarkTag[i] })
            if (tag) {
                tags.push(tag.id)
            } else {
                tag = new Tag({ title: bookmarkTag[i] })
                await tag.save()
                tags.push(tag.id)
            }
        }
        bookmarks.tags = [...tags]
        const bookmark = new Bookmark(bookmarks)
        await bookmark.save()
        res.status(201).send(bookmark)
    } catch (e) {
        res.status(400).send(e)
    }
})


router.delete('/bookmark/:id', async (req, res) => {
    const id = req.params.id
    try {
        const bookmark = await Bookmark.findByIdAndDelete(id)
        if (!bookmark) {
            return res.status(404).send({
                error: "data not present"
            })
        }
        res.status(200).send(bookmark)
    } catch (e) {
        res.status(404).send(e)
    }
})


router.get('/bookmark', async (req, res) => {
    try {
        const bookmarks = await Bookmark.find().populate('tags')
        res.status(200).send(bookmarks)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/bookmark/:id', async (req, res) => {
    try {
        const bookmark = await Bookmark.findById(req.params.id)
        if (!bookmark) {
            return res.status(404).send({
                error: 'bookmark not present'
            })
        }
        let tag = await Tag.findOne({ title: req.body.tag })
        if (!tag) {
            tag = new Tag({ title: req.body.tag })
            await tag.save()
        } else {
            let check = false
            for (let i = 0; i < bookmark.tags.length; i++) {

                if (bookmark.tags[i].equals(tag._id)) {
                    check = true
                    break
                }
            }
            if (check) {
                return res.status(400).send({
                    error: 'tag already present'
                })
            }
        }
        bookmark.tags.push(tag._id)
        bookmark.timeUpdated = Date.now()
        bookmark.save()
        res.status(200).send(bookmark)

    } catch (e) {
        res.status(500).send(e)
    }
})


router.post('/removebookmarktag/:id', async (req, res) => {
    try {
        const bookmark = await Bookmark.findById(req.params.id)
        if (!bookmark) {
            return res.status(404).send({
                error: 'bookmark not found'
            })
        }
        let tag = await Tag.findOne({ title: req.body.tag })
        if (!tag) {
            return res.status(404).send({
                error: 'tag not found'
            })
        } else {

            let check = false
            for (let i = 0; i < bookmark.tags.length; i++) {

                if (bookmark.tags[i].equals(tag._id)) {
                    bookmark.tags.splice(i, 1);
                    check = true
                    break;
                }
            }
            if (!check) {
                return res.status(404).send({
                    error: 'tag not present in this bookmark'
                })
            }
        }
        bookmark.timeUpdated = Date.now()
        bookmark.save()
        res.status(200).send(bookmark)

    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router
