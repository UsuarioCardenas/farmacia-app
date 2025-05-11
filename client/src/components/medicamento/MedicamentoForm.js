import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import MedicamentoService from '../../services/medicamento.service';

const MedicamentoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [medicamento, setMedicamento] = useState({
    CodMedicamento: '',
    descripcionMed: '',
    fechaFabricacion: '',
    fechaVencimiento: '',
    Presentacion: '',
    stock: 0,
    precioVentaUni: 0,
    precioVentaPres: 0,
    CodTipoMed: '',
    Marca: '',
    CodEspec: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      MedicamentoService.get(id)
        .then(response => {
          const data = response.data;
          // Formatear fechas para input type="date"
          if (data.fechaFabricacion) {
            data.fechaFabricacion = new Date(data.fechaFabricacion).toISOString().split('T')[0];
          }
          if (data.fechaVencimiento) {
            data.fechaVencimiento = new Date(data.fechaVencimiento).toISOString().split('T')[0];
          }
          setMedicamento(data);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error al cargar el medicamento:", error);
          setMessage("Error al cargar el medicamento. " + error.response?.data?.mensaje || error.message);
          setLoading(false);
        });
    }
  }, [id, isEditMode]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMedicamento({
      ...medicamento,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    if (isEditMode) {
      MedicamentoService.update(id, medicamento)
        .then(response => {
          setMessage("Medicamento actualizado exitosamente");
          setSuccess(true);
          setLoading(false);
          setTimeout(() => navigate('/medicamentos'), 2000);
        })
        .catch(error => {
          setMessage("Error al actualizar el medicamento. " + (error.response?.data?.mensaje || error.message));
          setSuccess(false);
          setLoading(false);
        });
    } else {
      MedicamentoService.create(medicamento)
        .then(response => {
          setMessage("Medicamento creado exitosamente");
          setSuccess(true);
          setLoading(false);
          setTimeout(() => navigate('/medicamentos'), 2000);
        })
        .catch(error => {
          setMessage("Error al crear el medicamento. " + (error.response?.data?.mensaje || error.message));
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
            <Card.Header as="h5">{isEditMode ? 'Editar Medicamento' : 'Nuevo Medicamento'}</Card.Header>
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
                    name="CodMedicamento"
                    value={medicamento.CodMedicamento}
                    onChange={handleChange}
                    required
                    disabled={isEditMode}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    type="text"
                    name="descripcionMed"
                    value={medicamento.descripcionMed}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Fecha de Fabricación</Form.Label>
                      <Form.Control
                        type="date"
                        name="fechaFabricacion"
                        value={medicamento.fechaFabricacion}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Fecha de Vencimiento</Form.Label>
                      <Form.Control
                        type="date"
                        name="fechaVencimiento"
                        value={medicamento.fechaVencimiento}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Presentación</Form.Label>
                  <Form.Control
                    type="text"
                    name="Presentacion"
                    value={medicamento.Presentacion}
                    onChange={handleChange}
                  />
                </Form.Group>
                
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Stock</Form.Label>
                      <Form.Control
                        type="number"
                        name="stock"
                        value={medicamento.stock}
                        onChange={handleChange}
                        required
                        min="0"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Precio Unitario</Form.Label>
                      <Form.Control
                        type="number"
                        name="precioVentaUni"
                        value={medicamento.precioVentaUni}
                        onChange={handleChange}
                        required
                        step="0.01"
                        min="0"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Precio Presentación</Form.Label>
                      <Form.Control
                        type="number"
                        name="precioVentaPres"
                        value={medicamento.precioVentaPres}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Tipo de Medicamento</Form.Label>
                  <Form.Control
                    type="text"
                    name="CodTipoMed"
                    value={medicamento.CodTipoMed}
                    onChange={handleChange}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Marca</Form.Label>
                  <Form.Control
                    type="text"
                    name="Marca"
                    value={medicamento.Marca}
                    onChange={handleChange}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Especialidad</Form.Label>
                  <Form.Control
                    type="text"
                    name="CodEspec"
                    value={medicamento.CodEspec}
                    onChange={handleChange}
                  />
                </Form.Group>
                
                <div className="d-flex justify-content-between">
                  <Button variant="secondary" onClick={() => navigate('/medicamentos')}>
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

export default MedicamentoForm;