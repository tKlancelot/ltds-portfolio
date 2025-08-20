// userUtils.js

export function getToken() {
    return localStorage.getItem('token');
}

export function getRole() {
    return localStorage.getItem('role');
}


