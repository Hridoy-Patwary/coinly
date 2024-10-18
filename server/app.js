const express = require('express');
const cors = require('cors');

const connectDB = require('./connection');
const { createTable } = require('./models/createTables');

// import routes
const signUp = require('./routes/auth/signup');
const signIn = require('./routes/auth/signin');


// setup everything
const db = connectDB();

const PORT = 4000;
const app = express();

createTable(db)
app.locals.db = db;
app.use(cors())


app.get('/', (req, res) => {
    res.send('hello world');
})

// intialize routes
app.use('/auth/signup', signUp);
app.use('/auth/signin', signIn);


app.listen(PORT, () => {
    console.log('Server started at: '+PORT);
})