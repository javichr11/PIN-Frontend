// src/api/api.js
import axios from 'axios';

// Reemplaza con la URL de tu API backend
const API_URL = 'https://chuzjrzthjfucwgkxroj.supabase.co'; 

const api = axios.create({
  baseURL: API_URL,
  timeout: 1000,
  headers: { 'Content-Type': 'application/json' }
});

export default api;