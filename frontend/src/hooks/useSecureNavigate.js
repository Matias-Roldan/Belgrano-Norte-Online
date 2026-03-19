// hooks/useSecureNavigate.js
// ─────────────────────────────────────────────
// Hook de navegacion segura — previene open redirect
// validando la ruta contra una allowlist antes de navegar.
// ─────────────────────────────────────────────
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { RUTAS_VALIDAS } from '../utils/constantes';

// [SEC-FIX] Wrapper seguro sobre useNavigate de React Router.
// Solo permite navegar a rutas definidas en RUTAS_VALIDAS.
export function useSecureNavigate() {
  const navigate = useNavigate();
  return useCallback((ruta) => {
    if (typeof ruta !== 'string') return;
    const normalizada = ruta.split('?')[0].split('#')[0];
    if (RUTAS_VALIDAS.has(normalizada)) {
      navigate(ruta);
    } else {
      console.warn('[SEC] Intento de navegacion a ruta no permitida:', ruta);
    }
  }, [navigate]);
}
