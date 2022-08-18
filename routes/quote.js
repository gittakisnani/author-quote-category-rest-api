const express = require('express');
const router = express.Router();

const Quote = require('../models/Quote');
const Author = require('../models/Author')
const Category = require('../models/Category')
const getAuthor = require('../middleware/getAuthor');
const getCategory = require('../middleware/getCategory');


router.post('/', getAuthor, getCategory, async (req, res) => {
    try {
        const quote = new Quote({
            quote: req.body.quote,
            author_id: res.author_id,
            category_id: res.category_id
        })
    
        const newQuote = await quote.save();
        res.status(201).json(newQuote)
    } catch(err) {
        res.status(500).json(err.message)
    }
})

//Get all Quotes
router.get('/', async (req, res) => {
    try {
        const allQuotes = [];
        const quotes = await Quote.find();
        for( quote of quotes ) {
            const author = await Author.findById(quote.author_id);
            const category = await Category.findById(quote.category_id);
            allQuotes.push({ quote, author, category})
        }
        res.json(allQuotes)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
})

router.get('/:id', async (req, res) => {
    try {
        const quote = await Quote.findById(req.params.id);
        if(!quote) return res.status(404).json({ message: 'Cannot find quote'});
        const myQuote = [];
        const author = await Author.findById(quote.author_id);
        const category = await Category.findById(quote.category_id);
        myQuote.push({ quote, author, category});
        res.json(myQuote)
    } catch(err) {
        res.status(500).json({ error: err.message})
    }
})

router.put('/:id', getAuthor, getCategory, async (req, res) => {
    try {
        const quote = await Quote.findById(req.params.id);
        if(!quote) return res.status(404).json({ message: 'Quote not found'});
        if(req.body.quote) quote.quote = req.body.quote;
        quote.author_id = res.author_id;
        quote.category_id = res.category_id;
        const updatedQuote = await quote.save();
        res.status(201).json(updatedQuote)
    } catch(err) {
        res.status(500).json({ error: err.message})
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const quote = await Quote.findById(req.params.id);
        if(!quote) return res.status(404).json({ message: 'Quote not found'});
        await quote.deleteOne();
        res.json({ message: 'Quote deleted'})
    } catch(err) {
        res.status(500).json({ error: err.message})
    }
})

module.exports = router;