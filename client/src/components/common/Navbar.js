import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import AuthService from '../../services/auth.service';

const NavBar = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">Sistema de Farmacia</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {currentUser && (
              <>
                <Nav.Link as={Link} to="/dashboard">Inicio</Nav.Link>
                
                {/* Menú de Medicamentos - Visible para todos los usuarios */}
                <NavDropdown title="Medicamentos" id="medicamentos-dropdown">
                  <NavDropdown.Item as={Link} to="/medicamentos">Listar Medicamentos</NavDropdown.Item>
                  {(currentUser.rol === 'admin' || currentUser.rol === 'moderador') && (
                    <NavDropdown.Item as={Link} to="/medicamentos/nuevo">Nuevo Medicamento</NavDropdown.Item>
                  )}
                </NavDropdown>
                
                {/* Menú de Laboratorios - Visible para todos los usuarios */}
                <NavDropdown title="Laboratorios" id="laboratorios-dropdown">
                  <NavDropdown.Item as={Link} to="/laboratorios">Listar Laboratorios</NavDropdown.Item>
                  {(currentUser.rol === 'admin' || currentUser.rol === 'moderador') && (
                    <NavDropdown.Item as={Link} to="/laboratorios/nuevo">Nuevo Laboratorio</NavDropdown.Item>
                  )}
                </NavDropdown>
                
                {/* Menú de Órdenes de Compra - Visible para todos los usuarios */}
                <NavDropdown title="Órdenes de Compra" id="ordenes-dropdown">
                  <NavDropdown.Item as={Link} to="/ordenes-compra">Listar Órdenes</NavDropdown.Item>
                  {(currentUser.rol === 'admin' || currentUser.rol === 'moderador') && (
                    <NavDropdown.Item as={Link} to="/ordenes-compra/nueva">Nueva Orden</NavDropdown.Item>
                  )}
                </NavDropdown>
                
                {/* Sección de Administración - Solo visible para administradores */}
                {currentUser.rol === 'admin' && (
                  <NavDropdown title="Administración" id="admin-dropdown">
                    <NavDropdown.Item as={Link} to="/usuarios">Gestionar Usuarios</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/reportes">Reportes</NavDropdown.Item>
                  </NavDropdown>
                )}
              </>
            )}
          </Nav>
          
          <Nav>
            {currentUser ? (
              <>
                <NavDropdown 
                  title={`${currentUser.username} (${currentUser.rol})`} 
                  id="usuario-dropdown"
                >
                  <NavDropdown.Item as={Link} to="/perfil">Mi Perfil</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logOut}>Cerrar Sesión</NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Iniciar Sesión</Nav.Link>
                <Nav.Link as={Link} to="/register">Registrarse</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;