import axios from 'axios';

const develop = 'http://192.168.100.25:3000';


const api = axios.create({
  baseURL: develop,
});

export default api;