import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Container, Row, Col, Form, InputGroup, Badge } from 'react-bootstrap';
import axios from '../../utils/axios-interceptor';
import AuthService from '../../services/auth.service';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    if (currentUser && currentUser.rol === 'admin') {
      fetchUsers();
    } else {
      setError('No tienes permisos para acceder a esta página');
      setLoading(false);
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/roles/usuarios');
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
      setError(`Error al cargar los usuarios: ${err.response?.data?.mensaje || err.message}`);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(`/api/roles/usuarios/${userId}/rol`, { rol: newRole });
      fetchUsers(); // Recargar la lista después de actualizar
    } catch (err) {
      console.error('Error al cambiar rol:', err);
      alert(`Error al cambiar el rol: ${err.response?.data?.mensaje || err.message}`);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <Badge bg="danger">Administrador</Badge>;
      case 'moderador':
        return <Badge bg="warning" text="dark">Moderador</Badge>;
      case 'usuario':
        return <Badge bg="info">Usuario</Badge>;
      default:
        return <Badge bg="secondary">{role}</Badge>;
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.rol?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2>Gestión de Usuarios</h2>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <Button variant="outline-secondary">
              Buscar
            </Button>
          </InputGroup>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{getRoleBadge(user.rol)}</td>
                <td>
                  <Form.Select
                    size="sm"
                    value={user.rol}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    disabled={user.id === currentUser.id} // No permitir cambiar el propio rol
                    style={{ width: 'auto', display: 'inline-block' }}
                    className="me-2"
                  >
                    <option value="usuario">Usuario</option>
                    <option value="moderador">Moderador</option>
                    <option value="admin">Administrador</option>
                  </Form.Select>
                  
                  {user.id === currentUser.id && (
                    <small className="text-muted">(Usuario actual)</small>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No se encontraron usuarios
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default UserList;