import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Table } from 'react-bootstrap';
import AuthService from '../../services/auth.service';

const Profile = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  if (!currentUser) {
    return (
      <Container className="mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Perfil de Usuario</h2>
      
      <Row>
        <Col md={6} className="mb-4">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-4">Información Personal</Card.Title>
              <Table>
                <tbody>
                  <tr>
                    <th style={{ width: '30%' }}>ID:</th>
                    <td>{currentUser.id}</td>
                  </tr>
                  <tr>
                    <th>Usuario:</th>
                    <td>{currentUser.username}</td>
                  </tr>
                  <tr>
                    <th>Email:</th>
                    <td>{currentUser.email}</td>
                  </tr>
                  <tr>
                    <th>Rol:</th>
                    <td>
                      <span className={`badge ${
                        currentUser.rol === 'admin' ? 'bg-danger' : 
                        currentUser.rol === 'moderador' ? 'bg-warning text-dark' : 'bg-info'
                      }`}>
                        {currentUser.rol === 'admin' ? 'Administrador' : 
                         currentUser.rol === 'moderador' ? 'Moderador' : 'Usuario'}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-4">Permisos de Sistema</Card.Title>
              <Table>
                <thead>
                  <tr>
                    <th>Acción</th>
                    <th>Permiso</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Ver registros</td>
                    <td><i className="bi bi-check-circle-fill text-success"></i></td>
                  </tr>
                  <tr>
                    <td>Crear registros</td>
                    <td>
                      {(currentUser.rol === 'admin' || currentUser.rol === 'moderador') ? (
                        <i className="bi bi-check-circle-fill text-success"></i>
                      ) : (
                        <i className="bi bi-x-circle-fill text-danger"></i>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Editar registros</td>
                    <td>
                      {(currentUser.rol === 'admin' || currentUser.rol === 'moderador') ? (
                        <i className="bi bi-check-circle-fill text-success"></i>
                      ) : (
                        <i className="bi bi-x-circle-fill text-danger"></i>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Eliminar registros</td>
                    <td>
                      {currentUser.rol === 'admin' ? (
                        <i className="bi bi-check-circle-fill text-success"></i>
                      ) : (
                        <i className="bi bi-x-circle-fill text-danger"></i>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Gestionar usuarios</td>
                    <td>
                      {currentUser.rol === 'admin' ? (
                        <i className="bi bi-check-circle-fill text-success"></i>
                      ) : (
                        <i className="bi bi-x-circle-fill text-danger"></i>
                      )}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-4">Información de Sesión</Card.Title>
              <p><strong>Token de acceso:</strong></p>
              <div className="border p-3 bg-light">
                <code style={{ wordBreak: 'break-all' }}>
                  {currentUser.accessToken.substring(0, 20)}...
                  {currentUser.accessToken.substring(currentUser.accessToken.length - 20)}
                </code>
              </div>
              <p className="text-muted mt-2"><small>Por razones de seguridad, solo se muestra una parte del token.</small></p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;