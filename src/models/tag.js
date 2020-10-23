const mongoose = require('mongoose')

const TagsSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true,
    },
    timeCreated: {
        type: Date,
        default: Date.now()
    },
    timeUpdated: {
        type: Date,
        default: Date.now()
    }
})

const Tag = mongoose.model('Tag', TagsSchema)

module.exports = Tag
