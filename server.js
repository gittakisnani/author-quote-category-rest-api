const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser')

require('dotenv').config();
const connectDB = require('./config/db');
const db = process.env.DATABASE_URI;
const app = express();
const PORT   = process.env.PORT || 3000;

//Connecting to MongoDB...
connectDB(db);


app.use(cors())


app.options('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Authorization, Content-Length, X-Requested-With');
    res.send(200)
})

app.use(bodyParser.json())


app.use('/quotes', require('./routes/quote'));
app.use('/categories', require('./routes/category'));
app.use('/authors', require('./routes/author'));



app.use((req, res, next) => {
    console.log(`${req.method}, ${req.path} - ${req.ip}`);
    next()
})

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.all('*', (req, res) => res.send('Invalid Route'))

app.listen(PORT, () => console.log('Running on PORT ' + PORT))