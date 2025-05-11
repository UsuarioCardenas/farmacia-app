import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

// Componentes comunes
import NavBar from './components/common/Navbar';

// Páginas y componentes
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/auth/Profile';
import Dashboard from './pages/Dashboard';

// Componentes de Medicamento
import MedicamentoList from './components/medicamento/MedicamentoList';
import MedicamentoForm from './components/medicamento/MedicamentoForm';
import MedicamentoDetail from './components/medicamento/MedicamentoDetail';

// Componentes de Laboratorio
import LaboratorioList from './components/laboratorio/LaboratorioList';
import LaboratorioForm from './components/laboratorio/LaboratorioForm';
import LaboratorioDetail from './components/laboratorio/LaboratorioDetail';

// Componentes de Orden de Compra
import OrdenCompraList from './components/ordenCompra/OrdenCompraList';
import OrdenCompraForm from './components/ordenCompra/OrdenCompraForm';
import OrdenCompraDetail from './components/ordenCompra/OrdenCompraDetail';

// Componentes de Administración
import UserList from './components/admin/UserList';
import ReportView from './components/admin/ReportView';

// Servicio de autenticación
import AuthService from './services/auth.service';

// Componente para proteger rutas
const PrivateRoute = ({ children }) => {
  const isLoggedIn = AuthService.getCurrentUser();
  return isLoggedIn ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Rutas protegidas */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            
            <Route path="/perfil" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            
            {/* Rutas de Medicamentos */}
            <Route path="/medicamentos" element={
              <PrivateRoute>
                <MedicamentoList />
              </PrivateRoute>
            } />
            <Route path="/medicamentos/nuevo" element={
              <PrivateRoute>
                <MedicamentoForm />
              </PrivateRoute>
            } />
            <Route path="/medicamentos/:id" element={
              <PrivateRoute>
                <MedicamentoDetail />
              </PrivateRoute>
            } />
            <Route path="/medicamentos/editar/:id" element={
              <PrivateRoute>
                <MedicamentoForm />
              </PrivateRoute>
            } />
            
            {/* Rutas de Laboratorios */}
            <Route path="/laboratorios" element={
              <PrivateRoute>
                <LaboratorioList />
              </PrivateRoute>
            } />
            <Route path="/laboratorios/nuevo" element={
              <PrivateRoute>
                <LaboratorioForm />
              </PrivateRoute>
            } />
            <Route path="/laboratorios/:id" element={
              <PrivateRoute>
                <LaboratorioDetail />
              </PrivateRoute>
            } />
            <Route path="/laboratorios/editar/:id" element={
              <PrivateRoute>
                <LaboratorioForm />
              </PrivateRoute>
            } />
            
            {/* Rutas de Órdenes de Compra */}
            <Route path="/ordenes-compra" element={
              <PrivateRoute>
                <OrdenCompraList />
              </PrivateRoute>
            } />
            <Route path="/ordenes-compra/nueva" element={
              <PrivateRoute>
                <OrdenCompraForm />
              </PrivateRoute>
            } />
            <Route path="/ordenes-compra/:id" element={
              <PrivateRoute>
                <OrdenCompraDetail />
              </PrivateRoute>
            } />
            <Route path="/ordenes-compra/editar/:id" element={
              <PrivateRoute>
                <OrdenCompraForm />
              </PrivateRoute>
            } />
            
            {/* Rutas de Administración */}
            <Route path="/usuarios" element={
              <PrivateRoute>
                <UserList />
              </PrivateRoute>
            } />
            
            <Route path="/reportes" element={
              <PrivateRoute>
                <ReportView />
              </PrivateRoute>
            } />
            
            {/* Ruta de redirección por defecto */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;