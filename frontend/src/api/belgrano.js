// api/belgrano.js
// ─────────────────────────────────────────────
// Cliente Axios centralizado para la API de Belgrano Norte.
// ─────────────────────────────────────────────
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => {
    if (Array.isArray(response.data) && Array.isArray(response.data[0])) {
      response.data = response.data[0];
    }
    return response;
  },
  (error) => {
    // [SEC-FIX] Si el token expiro, limpiar sesion y redirigir al panel
    if (error.response?.status === 401) {
      sessionStorage.removeItem('panel_token');
      delete api.defaults.headers.common['Authorization'];
      if (window.location.pathname.startsWith('/panel')) {
        window.location.href = '/panel';
      }
    }
    console.error('[BelgranoAPI] Error:', error.message);
    return Promise.reject(error);
  }
);

export default api;
