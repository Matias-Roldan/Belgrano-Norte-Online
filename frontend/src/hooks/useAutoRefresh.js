// hooks/useAutoRefresh.js
// ─────────────────────────────────────────────
// Hook para refrescar datos automaticamente cada N ms.
// Sin cambios respecto a la version original.
// ─────────────────────────────────────────────
import { useEffect, useRef } from 'react';

export function useAutoRefresh(callback, intervalo = 60000) {
  const callbackRef = useRef(callback);

  // Mantener referencia actualizada del callback
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    // Ejecutar inmediatamente al montar
    callbackRef.current();

    const id = setInterval(() => {
      callbackRef.current();
    }, intervalo);

    return () => clearInterval(id);
  }, [intervalo]);
}
