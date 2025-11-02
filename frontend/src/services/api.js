import axios from 'axios';

// Create an 'api' instance
const api = axios.create({
  baseURL: '/api' // The proxy will handle this
});

/*
  This is the magic part.
  An 'interceptor' is a function that runs BEFORE each request.
  This one checks if we have a token in localStorage.
  If we do, it adds it to the 'x-auth-token' header.
  Now, every request we make with this 'api' instance is authenticated.
*/
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
   config.headers.Authorization = `Bearer ${token}`;

  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default api