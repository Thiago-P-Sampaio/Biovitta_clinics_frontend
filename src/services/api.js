import axios from 'axios';

const api = axios.create({
  baseURL: 'https://biovitta.azurewebsites.net/biovitta',
});

export default api;
