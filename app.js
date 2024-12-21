const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => res.render('signup'));
app.get('/login', (req, res) => res.render('login'));
app.get('/signup', (req, res) => res.render('signup'));

const passwords = {};

app.post('/login', (req, res) => {
    const keys = ['login'];
    const errors = validate(req.body, keys);
    if(Object.keys(errors).length > 0){
        res.status(400).json(errors);
        return;
    }

    const login = req.body.login;
    if(passwords[login] === undefined){
        res.status(404).json({ login:'User not found' });
        return;
    }

    if(passwords[login] !== req.body.password){
        res.status(401).json({ password:'Password is incorrect' });
        return;
    }

    let message = `Hello, ${req.body.login}!`;
    res.status(200).json({ message: message });
})

app.post('/signup', (req, res) => {
    const keys = ['login', 'email', 'password', 'confirm_password'];
    const errors = validate(req.body, keys);
    if(Object.keys(errors).length > 0){
        res.status(400).json(errors);
        return;
    }

    const login = req.body.login;
    if(passwords[login] !== undefined){
        res.status(400).json({ login: "Login already taken"});
        return;
    }

    passwords[login] = req.body.password;
    let message = `Hello, ${req.body.login}! Check your email address ${req.body.email} to verify account`;
    res.status(200).json({ message: message});
})

app.get('/getStats', (req, res) => res.status(200)
        .json({ userCount : Object.keys(passwords).length, currentTime : new Date().toLocaleTimeString() }));

app.listen(3000, () => console.log('Server started on port 3000'));


function validate(data, keys) {
    const errors = {}

    for(const key of keys){
        const value = data[key]?.trim();
        if(value === '' || value == null){
            errors[key] = 'Field is required';
            continue;
        }

        if(key === 'email'){
            validateEmail(value, errors);
        }

        if(key === 'password'){
            validatePassword(data, errors);
        }
    }

    return errors;
}

function validateEmail(email, errors){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(emailRegex.test(email) === false) {
        errors.email = 'Please enter a valid email address';
    }
}

function validatePassword(data, errors){
    if(data.password !== data.confirm_password) {
        errors.confirm_password = 'Passwords do not match';
    }
    if(data.password.length < 12) {
        errors.password = 'Please enter minimum 12 characters. Special characters are not required';
    }
    if(data.password.length > 50) {
        errors.password = 'Please enter no more than 50 characters';
    }
}