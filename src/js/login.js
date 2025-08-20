let loginFrame = document.querySelector('#login');  
let loginForm = document.getElementById('login-form');
let adminFrame = document.querySelector('#admin');
import { apiUrl } from '../utils/config.js';

// gestion du formulaire de login 

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);
    const username = formData.get('username');
    const password = formData.get('password');

    // add username and password to formData
    formData.append('username', username);
    formData.append('password', password);


    const response = await fetch(`${apiUrl}/api/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(formData))
    });
    const data = await response.json();
    if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.data.role);
        localStorage.setItem('username', data.data.username);
        localStorage.setItem('userId', data.data.id);
        window.location.href = '/';
    }
});