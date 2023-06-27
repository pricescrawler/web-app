import axios from 'axios';

const urlEnv = import.meta.env.VITE_API_URL;
const timeoutEnv = import.meta.env.VIT_API_TIMEOUT || 30000;

const api = axios.create({
  baseURL: urlEnv,
  timeout: timeoutEnv
});

export default api;
