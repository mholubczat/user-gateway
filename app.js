const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => res.render('signup'));
app.get('/login', (req, res) => res.render('login'));
app.get('/signup', (req, res) => res.render('signup'));

const passwords = {};

app.post('/login', (req, res) => {
    const login = req.body.login;

    if(passwords[login] === undefined){
        res.status(404).json({ success: false, message:'User not found' });
        return;
    }

    if(passwords[login] !== req.body.password){
        res.status(401).json({ success: false, message:'Password is incorrect' });
        return;
    }

    let message = `Hello, ${req.body.login}!`;
    res.status(200).json({ success: true, message: message });
})

app.post('/signup', (req, res) => {
    const login = req.body.login;

    if(passwords[login] === undefined) {
        passwords[login] = req.body.password;
        let message = `Hello, ${req.body.login}! Check your email address ${req.body.email} to verify account!`;
        res.status(200).json({success: true, message: message});
        return;
    }

    res.status(400).json({success: false, message: "Login already taken"});
})

app.listen(3000, () => console.log('Server started on port 3000'));