// src/components/medicamento/MedicamentoDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Card, Row, Col, Button, Table, Badge } from 'react-bootstrap';
import MedicamentoService from '../../services/medicamento.service';
import AuthService from '../../services/auth.service';

const MedicamentoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [medicamento, setMedicamento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }

    MedicamentoService.get(id)
      .then(response => {
        setMedicamento(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar el medicamento:", err);
        setError("Error al cargar los datos del medicamento. " + (err.response?.data?.mensaje || err.message));
        setLoading(false);
      });
  }, [id]);

  const handleDelete = () => {
    if (window.confirm('¿Está seguro de eliminar este medicamento?')) {
      MedicamentoService.delete(id)
        .then(() => {
          navigate('/medicamentos');
        })
        .catch(err => {
          console.error("Error al eliminar el medicamento:", err);
          setError("Error al eliminar el medicamento. " + (err.response?.data?.mensaje || err.message));
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
        <Button as={Link} to="/medicamentos" variant="primary">
          Volver a la lista
        </Button>
      </Container>
    );
  }

  if (!medicamento) {
    return (
      <Container className="mt-4">
        <div className="alert alert-warning">No se encontró el medicamento solicitado.</div>
        <Button as={Link} to="/medicamentos" variant="primary">
          Volver a la lista
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card className="shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Detalles del Medicamento</h4>
          <div>
            <Button 
              as={Link} 
              to="/medicamentos" 
              variant="outline-secondary" 
              className="me-2"
            >
              Volver
            </Button>
            
            {currentUser && (currentUser.rol === 'admin' || currentUser.rol === 'moderador') && (
              <Button
                as={Link}
                to={`/medicamentos/editar/${id}`}
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
            <Col md={6}>
              <Table bordered>
                <tbody>
                  <tr>
                    <th style={{ width: '40%' }}>Código</th>
                    <td>{medicamento.CodMedicamento}</td>
                  </tr>
                  <tr>
                    <th>Descripción</th>
                    <td>{medicamento.descripcionMed}</td>
                  </tr>
                  <tr>
                    <th>Presentación</th>
                    <td>{medicamento.Presentacion || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Marca</th>
                    <td>{medicamento.Marca || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Tipo de Medicamento</th>
                    <td>{medicamento.CodTipoMed || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Especialidad</th>
                    <td>{medicamento.CodEspec || 'N/A'}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            
            <Col md={6}>
              <Table bordered>
                <tbody>
                  <tr>
                    <th style={{ width: '40%' }}>Stock</th>
                    <td>
                      {medicamento.stock}
                      {' '}
                      {medicamento.stock <= 10 && (
                        <Badge bg="danger">Stock Bajo</Badge>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>Precio Unitario</th>
                    <td>S/ {typeof medicamento.precioVentaUni === 'number' ? medicamento.precioVentaUni.toFixed(2) : '0.00'}</td>
                  </tr>
                  <tr>
                    <th>Precio por Presentación</th>
                    <td>S/ {typeof medicamento.precioVentaPres === 'number' ? medicamento.precioVentaPres.toFixed(2) : '0.00'}</td>
                  </tr>
                  <tr>
                    <th>Fecha de Fabricación</th>
                    <td>{medicamento.fechaFabricacion ? new Date(medicamento.fechaFabricacion).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Fecha de Vencimiento</th>
                    <td>
                      {medicamento.fechaVencimiento ? new Date(medicamento.fechaVencimiento).toLocaleDateString() : 'N/A'}
                      {' '}
                      {medicamento.fechaVencimiento && new Date(medicamento.fechaVencimiento) < new Date() && (
                        <Badge bg="danger">Vencido</Badge>
                      )}
                    </td>
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

export default MedicamentoDetail;