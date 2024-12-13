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
    const login = req.body.login;
    if(passwords[login] === undefined) {
        passwords[login] = req.body.password;
        let greeting = `Hello, ${req.body.login}! Check your email address ${req.body.email} to verify account!`;
        res.status(200).json({success: true, message: greeting});
        return;
    }
    res.status(200).json({success: false, message: "Login already taken"});
})

app.post('/login', (req, res) => {
    const login = req.body.login;

    if(passwords[login] === undefined){
        res.status(200).json({ success: false, message:'User not found' });
        return;
    }
    if(passwords[login] !== req.body.password){
        res.status(200).json({ success: false, message:'Password is incorrect' });
        return;
    }

    let greeting = `Hello, ${req.body.login}!`;
    res.status(200).json({ success: true, message: greeting });

})

app.listen(3000, () => console.log('Server started on port 3000'));

