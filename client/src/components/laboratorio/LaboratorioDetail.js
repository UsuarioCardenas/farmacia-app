// src/components/laboratorio/LaboratorioDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Card, Row, Col, Button, Table } from 'react-bootstrap';
import LaboratorioService from '../../services/laboratorio.service';
import AuthService from '../../services/auth.service';

const LaboratorioDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [laboratorio, setLaboratorio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }

    LaboratorioService.get(id)
      .then(response => {
        setLaboratorio(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar el laboratorio:", err);
        setError("Error al cargar los datos del laboratorio. " + (err.response?.data?.mensaje || err.message));
        setLoading(false);
      });
  }, [id]);

  const handleDelete = () => {
    if (window.confirm('¿Está seguro de eliminar este laboratorio?')) {
      LaboratorioService.delete(id)
        .then(() => {
          navigate('/laboratorios');
        })
        .catch(err => {
          console.error("Error al eliminar el laboratorio:", err);
          setError("Error al eliminar el laboratorio. " + (err.response?.data?.mensaje || err.message));
        });
    }
  };

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
        <Button as={Link} to="/laboratorios" variant="primary">
          Volver a la lista
        </Button>
      </Container>
    );
  }

  if (!laboratorio) {
    return (
      <Container className="mt-4">
        <div className="alert alert-warning">No se encontró el laboratorio solicitado.</div>
        <Button as={Link} to="/laboratorios" variant="primary">
          Volver a la lista
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card className="shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Detalles del Laboratorio</h4>
          <div>
            <Button 
              as={Link} 
              to="/laboratorios" 
              variant="outline-secondary" 
              className="me-2"
            >
              Volver
            </Button>
            
            {currentUser && (currentUser.rol === 'admin' || currentUser.rol === 'moderador') && (
              <Button
                as={Link}
                to={`/laboratorios/editar/${id}`}
                variant="warning"
                className="me-2"
              >
                Editar
              </Button>
            )}
            
            {currentUser && currentUser.rol === 'admin' && (
              <Button
                variant="danger"
                onClick={handleDelete}
              >
                Eliminar
              </Button>
            )}
          </div>
        </Card.Header>
        
        <Card.Body>
          <Row>
            <Col md={12}>
              <Table bordered hover>
                <tbody>
                  <tr>
                    <th style={{ width: '30%' }}>Código</th>
                    <td>{laboratorio.CodLab}</td>
                  </tr>
                  <tr>
                    <th>Razón Social</th>
                    <td>{laboratorio.razonSocial}</td>
                  </tr>
                  <tr>
                    <th>Dirección</th>
                    <td>{laboratorio.direccion || 'No especificada'}</td>
                  </tr>
                  <tr>
                    <th>Email</th>
                    <td>{laboratorio.email || 'No especificado'}</td>
                  </tr>
                  <tr>
                    <th>Teléfono</th>
                    <td>{laboratorio.telefono || 'No especificado'}</td>
                  </tr>
                  <tr>
                    <th>Contacto</th>
                    <td>{laboratorio.contacto || 'No especificado'}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LaboratorioDetail;