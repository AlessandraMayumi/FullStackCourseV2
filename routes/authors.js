const express = require('express')

const Author = require('../models/author')
const Book = require('../models/book')

const router = express.Router()

// All Authors Route 
router.get('/', async (req, res) => {
    let searchOptions = {}
    if(req.query != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const authors = await Author.find(searchOptions) // procura entre os autores que foram criados via POST
        res.locals.authenticated = req.isAuthenticated()
        res.render('authors/index', {
            authors: authors, // retorna os autores da lista que correspondem ao regex
            searchOptions: req.query // retorna a query para aparecer na barra de pesquisa
        })
    } catch (error) {
        res.redirect('/')
    }
})

// New Author Route
router.get('/new', isLoggedIn, (req, res) => {
    res.locals.authenticated = req.isAuthenticated()
    res.render('authors/new', { author: new Author() })
})

// Create Author Route
router.post('/', async(req, res) => {
    const author = new Author({
        name: req.body.name
    })
    try {
        const newAuthor = await author.save()
        res.redirect(`authors/${newAuthor.id}`)
    } catch(error) {
        res.locals.authenticated = req.isAuthenticated()
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating author'
        })
    }
})

// Show Author Route
router.get('/:id', async(req, res) => {
    try {
        const author = await Author.findById(req.params.id) 
        const books = await Book.find({ author: author.id }).limit(6).exec()
        res.locals.authenticated = req.isAuthenticated()
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        })
    } catch (error) {
        res.redirect('/')
    }
})

// Edit Author Route
router.get('/:id/edit', isLoggedIn, async(req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        res.locals.authenticated = req.isAuthenticated()
        res.render('authors/edit', {author: author})
    } catch (error) {
        res.redirect(`/authors`)
    }
    
})

// Update Author Route
router.put('/:id', async(req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`)
    } catch(error) {
        if (author == null) {
            res.redirect('/')
        } else {
            res.locals.authenticated = req.isAuthenticated()
            res.render('authors/new', {
                author: author,
                errorMessage: 'Error updating author'
            })
        }
    }
})

// Delete Author Route
router.delete('/:id', isLoggedIn, async(req, res) => {
    console.log('delete')
    let author
    try {
        author = await Author.findById(req.params.id)
        await author.remove()
        res.redirect(`/authors`)
    } catch(error) {
        if (author == null) {
            res.redirect('/')
        } else {        
            let books = await Book.find({ author: author.id }).limit(6).exec()
            res.render('authors/show', {
                author: author,
                booksByAuthor: books,
                errorMessage: error
            })
        }
    }
})

// Authenticate user Login
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router
