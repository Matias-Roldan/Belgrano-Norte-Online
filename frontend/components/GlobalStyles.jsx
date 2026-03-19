// components/GlobalStyles.jsx
// ─────────────────────────────────────────────
// Inyecta estilos globales, meta CSP y meta tags
// de seguridad en el <head> del documento.
// ─────────────────────────────────────────────
import { useEffect } from 'react';

// [SEC-FIX] CSP con condicional dev/prod.
// frame-ancestors y X-Frame-Options REMOVIDOS del meta — solo funcionan
// como HTTP headers. Configurarlos en el servidor (Nginx / Express / Vite).
const isDev = import.meta.env.DEV;

const CSP_POLICY = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  isDev
    ? "connect-src 'self' http://localhost:5000"
    : "connect-src 'self' https://tu-api-dominio.com",
  "img-src 'self' data: https:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

export default function GlobalStyles() {
  useEffect(() => {
    // [SEC-FIX] Inyectar meta CSP
    const existingCsp = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!existingCsp) {
      const cspMeta = document.createElement('meta');
      cspMeta.setAttribute('http-equiv', 'Content-Security-Policy');
      cspMeta.setAttribute('content', CSP_POLICY);
      document.head.insertBefore(cspMeta, document.head.firstChild);
    }

    // [SEC-FIX] Meta tags de seguridad que SI funcionan via HTML.
    // X-Frame-Options REMOVIDO — ignorado en meta tag (CWE-693).
    const metas = [
      { name: 'referrer', content: 'strict-origin-when-cross-origin' },
      { httpEquiv: 'X-Content-Type-Options', content: 'nosniff' },
    ];
    const insertados = metas.map(({ name, httpEquiv, content }) => {
      const m = document.createElement('meta');
      if (name) m.setAttribute('name', name);
      if (httpEquiv) m.setAttribute('http-equiv', httpEquiv);
      m.setAttribute('content', content);
      document.head.appendChild(m);
      return m;
    });

    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=Source+Sans+3:wght@400;500;600;700&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html  { background: #F5F5F0; }
      body  {
        background: #F5F5F0;
        color: #1A1A1A;
        font-family: 'Source Sans 3', sans-serif;
        -webkit-font-smoothing: antialiased;
        overflow-x: hidden;
      }
      ::-webkit-scrollbar { width: 5px; }
      ::-webkit-scrollbar-track { background: #eee; }
      ::-webkit-scrollbar-thumb { background: #C0392B; border-radius: 3px; }
      @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.3} }
      @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      .a1{animation:fadeUp .4s ease .05s both}
      .a2{animation:fadeUp .4s ease .12s both}
      .a3{animation:fadeUp .4s ease .20s both}
      .a4{animation:fadeUp .4s ease .28s both}
      .a5{animation:fadeUp .4s ease .36s both}
      .a6{animation:fadeUp .4s ease .44s both}
      button { font-family:'Source Sans 3',sans-serif; cursor:pointer; border:none; background:none; }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
      insertados.forEach(m => { if (m.parentNode) document.head.removeChild(m); });
    };
  }, []);

  return null;
}
