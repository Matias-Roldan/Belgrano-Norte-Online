// App.jsx
// ─────────────────────────────────────────────
// Router principal de la aplicacion.
// Solo define rutas — la logica vive en cada pagina
// y los componentes compartidos en /components.
// ─────────────────────────────────────────────
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

// Componentes globales
import GlobalStyles from '../components/GlobalStyles';
import NavBar from '../components/NavBar';

// Paginas publicas
import Inicio          from './pages/public/Inicio';
import Planificar      from './pages/public/Planificar';
import Avisos          from './pages/public/Avisos';
import QuienesSomos    from './pages/public/QuienesSomos';
import Recorrido       from './pages/public/Recorrido';
import Tarifas         from './pages/public/Tarifas';
import Contacto        from './pages/public/Contacto';
import Proximamente    from './pages/public/Proximamente';
import Tablero         from './pages/public/Tablero';

// Paginas admin
import PanelControl    from './pages/admin/PanelControl';
import AdminAvisos     from './pages/admin/AdminAvisos';
import AdminEstaciones from './pages/admin/AdminEstaciones';
import AdminTrenes     from './pages/admin/AdminTrenes';
import AdminServicios  from './pages/admin/AdminServicios';

export default function App() {
  return (
    <>
      <GlobalStyles/>
      <BrowserRouter>
        <Routes>
          {/* Publicas */}
          <Route path="/"              element={<Inicio/>}                           />
          <Route path="/tablero"       element={<Tablero/>}                          />
          <Route path="/planificar"    element={<Planificar/>}                       />
          <Route path="/avisos"        element={<Avisos/>}                           />
          <Route path="/quienes-somos" element={<QuienesSomos/>}                    />
          <Route path="/recorrido"     element={<Recorrido/>}                        />
          <Route path="/tarifa"        element={<Tarifas/>}                          />
          <Route path="/contacto"      element={<Contacto/>}                         />
          <Route path="/estaciones"    element={<Proximamente titulo="Estaciones"/>} />

          {/* Admin — protegidas por login en PanelControl */}
          <Route path="/panel"            element={<PanelControl/>}    />
          <Route path="/panel/avisos"     element={<AdminAvisos/>}     />
          <Route path="/panel/estaciones" element={<AdminEstaciones/>} />
          <Route path="/panel/trenes"     element={<AdminTrenes/>}     />
          <Route path="/panel/servicios"  element={<AdminServicios/>}  />

          {/* Cualquier ruta no definida vuelve al inicio */}
          <Route path="*" element={<Inicio/>}/>
        </Routes>
        <NavBar/>
      </BrowserRouter>
    </>
  );
}
