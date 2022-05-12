import axios from "axios";

const url = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: url,
});

export default api;
