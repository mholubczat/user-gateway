const express = require('express');
const app = express();
const passwords = {};

app.use(express.static('public'));
app.set('view engine', 'ejs');
const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => res.render('signup'));

app.get('/login', (req, res) => res.render('login'));

app.get('/signup', (req, res) => res.render('signup'));

app.post('/signup', (req, res) => {
    // add validation!
    const login = req.body.login;
    passwords[login] = req.body.password;
    let greeting = `Hello, ${req.body.login}! Check your email address ${req.body.email} to verify account!`;
    res.status(200).json({ greeting: greeting });
})

app.post('/login', (req, res) => {
    // add validation!
    const login = req.body.login;
    if(passwords[login] !== req.body.password){

    }
    const greeting = `Hello, ${req.body.login}! Check your email address ${req.body.email} to verify account!`;
    console.log(greeting);
    res.render('home', { greeting: greeting });
})

app.listen(3000, () => console.log('Server started on port 3000'));

