async function fetchStats(){
    try {
        const stats = await fetch("http://localhost:3000/getStats");
        const data = await stats.json();
        document.getElementById('stats').innerHTML =
            `<p>${data.userCount} registered users &bull; server time: ${data.currentTime}</p>`;
    } catch (error){
        console.error(error);
    }
}

fetchStats().then(() => setInterval(fetchStats, 3000));

function handleSuccessResponse(data) {
    const container = document.getElementById('container');
    container.innerHTML = '';
    const greeting = document.createElement('p');
    greeting.textContent = data.message;

    const logout = document.createElement('a');
    logout.href = '/login';
    logout.textContent = 'Log out';

    container.appendChild(greeting);
    container.appendChild(logout);
}

async function sendFormData() {
    const data = {
        login: document.getElementById('login').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        confirm_password: document.getElementById('confirm_password').value
    }

    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(error => error.remove());
    const errors = validate(data);

    if(Object.keys(errors).length > 0){
        displayErrors(errors);
        return;
    }

    const body = JSON.stringify({
        login: data.login,
        email: data.email,
        password: data.password,
        confirm_password: data.confirm_password
    });

    try {
        const response = await fetch('/signup', {
            method: 'POST',
            body: body,
            headers: {'Content-Type': 'application/json'}
       });

        let result = await response.json();
        if(response.ok) {
            handleSuccessResponse(result);
        }
        else {
            displayErrors(result);
        }
    } catch (error){
        console.error(error);
    }
}

window.onload = function () {
    const button = document.getElementById('signupButton');
    button.onclick = sendFormData;
}

function validate(data) {
    const errors = {};

    for (let key in data) {
        if(data[key] === ''){
            errors[key] = 'Field is required';
        }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(data.email !== '' && emailRegex.test(data.email) === false) {
        errors.email = 'Please enter a valid email address';
    }

    if(data.password !== ''){
        if(data.password !== data.confirm_password) {
            errors.confirm_password = 'Passwords do not match';
        }
        if(data.password.length < 12) {
            errors.password = 'Please enter minimum 12 characters. Special characters are not required';
        }
        if(data.password.length > 50) {
            errors.password = 'Please enter maximum 50 characters';
        }
    }

    return errors;
}

function displayErrors(errors) {
    for(let key in errors) {
        const input = document.getElementById(`${key}`);
        const parent = input.parentElement;

        const errorDiv = document.createElement('div');
        errorDiv.classList.add('error');
        errorDiv.textContent = errors[key];

        parent.appendChild(errorDiv);
    }
}
