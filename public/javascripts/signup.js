async function handleResponse(data) {
    const container = document.getElementById('container');
    const heading = container.querySelector('h1');
    heading.textContent = data.greeting;
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

    const body = JSON.stringify({login: data.login, email: data.email, password: data.password});

    try {
        const response = await fetch('/signup', {
            method: 'POST',
            body: body,
            headers: {'Content-Type': 'application/json'}
       });

        let result = await response.json();
        await handleResponse(result);
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
       const div = document.getElementById(`${key}div`);
       const errorDiv = document.createElement('div');
       errorDiv.classList.add('error');
       const message = document.createTextNode(errors[key]);
       errorDiv.appendChild(message);
       div.appendChild(errorDiv);
    }
}
