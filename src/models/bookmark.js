const mongoose = require('mongoose')
const Tag = require('./tag')


const bookmarkSchema = new mongoose.Schema({
    link: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
    },
    timeCreated: {
        type: Date,
        default: Date.now(),
    },
    timeUpdated: {
        type: Date,
        default: Date.now(),
    },
    publisher: {
        type: String
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
        unique: true,
    }]

})


const Bookmark = mongoose.model('Bookmark', bookmarkSchema)

module.exports = Bookmark