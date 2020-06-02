const mongoose = require('mongoose')

const coverImageBasePath = 'uploads/bookCovers'

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    publishDate: {
        type: Date,
        required: true 
    },
    pageCount: {
        type: Number 
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImage: {
        type: Buffer,
        required: true 
    },
    coverImageType: {
        type: String,
        require: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
    }
})

bookSchema
    .virtual('coverImagePath')
    .get(function() {
        if (this.coverImage != null && this.coverImageType != null) {
            return `data: ${this.coverImageType}; charset=utf-8; base64, ${this.coverImage.toString('base64')}`
        }
        
})

module.exports = mongoose.model('Book', bookSchema)
