async function handleResponse(data) {
    if(data.success) {
        const container = document.getElementById('container');
        container.innerHTML = '';
        const greeting = document.createElement('p');
        greeting.textContent = data.message;

        const logout = document.createElement('a');
        logout.href = '/login';
        logout.textContent = 'Log out';

        container.appendChild(greeting);
        container.appendChild(logout);
    } else {
        const errors = { password: data.message };
        displayErrors(errors);
    }
}

async function sendFormData() {
    const data = {
        login: document.getElementById('login').value,
        password: document.getElementById('password').value,
    }

    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(error => error.remove());
    const errors = validate(data);

    if(Object.keys(errors).length > 0){
        displayErrors(errors);
        return;
    }

    const body = JSON.stringify({login: data.login, password: data.password});

    try {
        const response = await fetch('/login', {
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
    const button = document.getElementById('loginButton');
    button.onclick = sendFormData;
}

function validate(data) {
    const errors = {};
    for (let key in data) {
        if(data[key] === ''){
            errors[key] = 'Field is required';
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