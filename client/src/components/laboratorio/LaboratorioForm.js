import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import LaboratorioService from '../../services/laboratorio.service';

const LaboratorioForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [laboratorio, setLaboratorio] = useState({
    CodLab: '',
    razonSocial: '',
    direccion: '',
    email: '',
    telefono: '',
    contacto: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      LaboratorioService.get(id)
        .then(response => {
          setLaboratorio(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error al cargar el laboratorio:", error);
          setMessage("Error al cargar el laboratorio. " + error.response?.data?.mensaje || error.message);
          setLoading(false);
        });
    }
  }, [id, isEditMode]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLaboratorio({
      ...laboratorio,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    if (isEditMode) {
      LaboratorioService.update(id, laboratorio)
        .then(response => {
          setMessage("Laboratorio actualizado exitosamente");
          setSuccess(true);
          setLoading(false);
          setTimeout(() => navigate('/laboratorios'), 2000);
        })
        .catch(error => {
          setMessage("Error al actualizar el laboratorio. " + (error.response?.data?.mensaje || error.message));
          setSuccess(false);
          setLoading(false);
        });
    } else {
      LaboratorioService.create(laboratorio)
        .then(response => {
          setMessage("Laboratorio creado exitosamente");
          setSuccess(true);
          setLoading(false);
          setTimeout(() => navigate('/laboratorios'), 2000);
        })
        .catch(error => {
          setMessage("Error al crear el laboratorio. " + (error.response?.data?.mensaje || error.message));
          setSuccess(false);
          setLoading(false);
        });
    }
  };
  
  if (loading && isEditMode) {
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
      <Row className="justify-content-center">
        <Col md={8}>
          <Card>
            <Card.Header as="h5">{isEditMode ? 'Editar Laboratorio' : 'Nuevo Laboratorio'}</Card.Header>
            <Card.Body>
              {message && (
                <Alert variant={success ? 'success' : 'danger'} className="mb-3">
                  {message}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Código</Form.Label>
                  <Form.Control
                    type="text"
                    name="CodLab"
                    value={laboratorio.CodLab}
                    onChange={handleChange}
                    required
                    disabled={isEditMode}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Razón Social</Form.Label>
                  <Form.Control
                    type="text"
                    name="razonSocial"
                    value={laboratorio.razonSocial}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control
                    type="text"
                    name="direccion"
                    value={laboratorio.direccion}
                    onChange={handleChange}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={laboratorio.email}
                    onChange={handleChange}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="text"
                    name="telefono"
                    value={laboratorio.telefono}
                    onChange={handleChange}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Contacto</Form.Label>
                  <Form.Control
                    type="text"
                    name="contacto"
                    value={laboratorio.contacto}
                    onChange={handleChange}
                  />
                </Form.Group>
                
                <div className="d-flex justify-content-between">
                  <Button variant="secondary" onClick={() => navigate('/laboratorios')}>
                    Cancelar
                  </Button>
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                      isEditMode ? 'Actualizar' : 'Guardar'
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LaboratorioForm;