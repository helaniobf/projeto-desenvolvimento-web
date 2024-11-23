import axios from 'axios';


const api = axios.create({
    baseURL: 'http://localhost:8000/',
    headers: {
        'Content-Type': 'application/json',
    },
});

const getCsrfToken = () => {
    const name = 'csrftoken';
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

const csrfToken = getCsrfToken();

axios.defaults.headers.common['X-CSRFToken'] = csrfToken;


api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    console.log(token) 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default api;
