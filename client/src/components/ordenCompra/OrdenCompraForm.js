// src/components/ordenCompra/OrdenCompraForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card, Alert, Table } from 'react-bootstrap';
import OrdenCompraService from '../../services/ordenCompra.service';
import LaboratorioService from '../../services/laboratorio.service';
import MedicamentoService from '../../services/medicamento.service';

const OrdenCompraForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  // Estados para la orden y sus detalles
  const [ordenCompra, setOrdenCompra] = useState({
    NroOrdenC: '',
    fechaEmision: new Date().toISOString().split('T')[0],
    Situacion: 'Pendiente',
    NroFacturaProv: '',
    CodLab: ''
  });
  
  const [detalles, setDetalles] = useState([]);
  const [nuevoDetalle, setNuevoDetalle] = useState({
    CodMedicamento: '',
    descripcion: '',
    cantidad: 1,
    precio: 0
  });
  
  // Estados para los datos de referencia
  const [laboratorios, setLaboratorios] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [medicamentoSeleccionado, setMedicamentoSeleccionado] = useState(null);
  
  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    // Cargar laboratorios
    LaboratorioService.getAll()
      .then(response => {
        setLaboratorios(response.data);
      })
      .catch(error => {
        console.error("Error al cargar laboratorios:", error);
        setMessage("Error al cargar laboratorios. " + error.response?.data?.mensaje || error.message);
      });
    
    // Cargar medicamentos
    MedicamentoService.getAll()
      .then(response => {
        setMedicamentos(response.data);
      })
      .catch(error => {
        console.error("Error al cargar medicamentos:", error);
        setMessage("Error al cargar medicamentos. " + error.response?.data?.mensaje || error.message);
      });
    
    // Si es modo edición, cargar la orden existente
    if (isEditMode) {
      OrdenCompraService.get(id)
        .then(response => {
          const ordenData = response.data;
          
          // Formatear la fecha para el input type="date"
          if (ordenData.fechaEmision) {
            ordenData.fechaEmision = new Date(ordenData.fechaEmision).toISOString().split('T')[0];
          }
          
          setOrdenCompra({
            NroOrdenC: ordenData.NroOrdenC,
            fechaEmision: ordenData.fechaEmision,
            Situacion: ordenData.Situacion,
            NroFacturaProv: ordenData.NroFacturaProv || '',
            CodLab: ordenData.CodLab
          });
          
          // Establecer los detalles si existen
          if (ordenData.DetalleOrdenCompras && ordenData.DetalleOrdenCompras.length > 0) {
            setDetalles(ordenData.DetalleOrdenCompras);
          }
          
          setLoading(false);
        })
        .catch(error => {
          console.error("Error al cargar la orden de compra:", error);
          setMessage("Error al cargar la orden de compra. " + error.response?.data?.mensaje || error.message);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [id, isEditMode]);
  
  const handleOrdenChange = (e) => {
    const { name, value } = e.target;
    setOrdenCompra({
      ...ordenCompra,
      [name]: value
    });
  };
  
  const handleNuevoDetalleChange = (e) => {
    const { name, value } = e.target;
    setNuevoDetalle({
      ...nuevoDetalle,
      [name]: value
    });
    
    // Si cambia el medicamento, actualizar la descripción y precio
    if (name === 'CodMedicamento') {
      const medSeleccionado = medicamentos.find(med => med.CodMedicamento === value);
      if (medSeleccionado) {
        setMedicamentoSeleccionado(medSeleccionado);
        setNuevoDetalle({
          ...nuevoDetalle,
          CodMedicamento: value,
          descripcion: medSeleccionado.descripcionMed + ' - ' + (medSeleccionado.Presentacion || ''),
          precio: medSeleccionado.precioVentaUni || 0
        });
      }
    }
  };
  
  const agregarDetalle = () => {
    if (!nuevoDetalle.CodMedicamento) {
      setMessage("Debe seleccionar un medicamento");
      setSuccess(false);
      return;
    }
    
    if (nuevoDetalle.cantidad <= 0) {
      setMessage("La cantidad debe ser mayor a 0");
      setSuccess(false);
      return;
    }
    
    // Verificar si el medicamento ya existe en los detalles
    const detalleExistente = detalles.find(
      detalle => detalle.CodMedicamento === nuevoDetalle.CodMedicamento
    );
    
    if (detalleExistente) {
      // Actualizar la cantidad del detalle existente
      const nuevosDetalles = detalles.map(detalle => {
        if (detalle.CodMedicamento === nuevoDetalle.CodMedicamento) {
          return {
            ...detalle,
            cantidad: parseInt(detalle.cantidad) + parseInt(nuevoDetalle.cantidad)
          };
        }
        return detalle;
      });
      
      setDetalles(nuevosDetalles);
    } else {
      // Agregar nuevo detalle
      setDetalles([...detalles, nuevoDetalle]);
    }
    
    // Limpiar el formulario de nuevo detalle
    setNuevoDetalle({
      CodMedicamento: '',
      descripcion: '',
      cantidad: 1,
      precio: 0
    });
    setMedicamentoSeleccionado(null);
    setMessage('');
  };
  
  const eliminarDetalle = (index) => {
    const nuevosDetalles = [...detalles];
    nuevosDetalles.splice(index, 1);
    setDetalles(nuevosDetalles);
  };
  
  const calcularTotal = () => {
    return detalles.reduce((total, detalle) => {
      return total + (detalle.cantidad * detalle.precio);
    }, 0).toFixed(2);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    if (!ordenCompra.CodLab) {
      setMessage("Debe seleccionar un laboratorio");
      setSuccess(false);
      setLoading(false);
      return;
    }
    
    if (detalles.length === 0) {
      setMessage("Debe agregar al menos un medicamento a la orden");
      setSuccess(false);
      setLoading(false);
      return;
    }
    
    const ordenData = {
      ordenCompra: {
        ...ordenCompra
      },
      detalles: detalles
    };
    
    if (isEditMode) {
      OrdenCompraService.update(id, ordenData)
        .then(response => {
          setMessage("Orden de compra actualizada exitosamente");
          setSuccess(true);
          setLoading(false);
          setTimeout(() => navigate('/ordenes-compra'), 2000);
        })
        .catch(error => {
          setMessage("Error al actualizar la orden de compra. " + (error.response?.data?.mensaje || error.message));
          setSuccess(false);
          setLoading(false);
        });
    } else {
      OrdenCompraService.create(ordenData)
        .then(response => {
          setMessage("Orden de compra creada exitosamente");
          setSuccess(true);
          setLoading(false);
          setTimeout(() => navigate('/ordenes-compra'), 2000);
        })
        .catch(error => {
          setMessage("Error al crear la orden de compra. " + (error.response?.data?.mensaje || error.message));
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
      <Card>
        <Card.Header as="h5">{isEditMode ? 'Editar Orden de Compra' : 'Nueva Orden de Compra'}</Card.Header>
        <Card.Body>
          {message && (
            <Alert variant={success ? 'success' : 'danger'} className="mb-3">
              {message}
            </Alert>
          )}
          
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Número de Orden</Form.Label>
                  <Form.Control
                    type="text"
                    name="NroOrdenC"
                    value={ordenCompra.NroOrdenC}
                    onChange={handleOrdenChange}
                    required
                    disabled={isEditMode}
                    placeholder="Ej. OC001"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Emisión</Form.Label>
                  <Form.Control
                    type="date"
                    name="fechaEmision"
                    value={ordenCompra.fechaEmision}
                    onChange={handleOrdenChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Laboratorio</Form.Label>
                  <Form.Select
                    name="CodLab"
                    value={ordenCompra.CodLab}
                    onChange={handleOrdenChange}
                    required
                  >
                    <option value="">Seleccione un laboratorio</option>
                    {laboratorios.map(lab => (
                      <option key={lab.CodLab} value={lab.CodLab}>
                        {lab.razonSocial}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Situación</Form.Label>
                  <Form.Select
                    name="Situacion"
                    value={ordenCompra.Situacion}
                    onChange={handleOrdenChange}
                    required
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Completada">Completada</option>
                    <option value="Cancelada">Cancelada</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Número de Factura del Proveedor</Form.Label>
              <Form.Control
                type="text"
                name="NroFacturaProv"
                value={ordenCompra.NroFacturaProv}
                onChange={handleOrdenChange}
                placeholder="Opcional - Ej. F-12345"
              />
            </Form.Group>
            
            <hr className="my-4" />
            
            <h5>Detalle de Medicamentos</h5>
            
            <Card className="mb-4">
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Medicamento</Form.Label>
                      <Form.Select
                        name="CodMedicamento"
                        value={nuevoDetalle.CodMedicamento}
                        onChange={handleNuevoDetalleChange}
                      >
                        <option value="">Seleccione un medicamento</option>
                        {medicamentos.map(med => (
                          <option key={med.CodMedicamento} value={med.CodMedicamento}>
                            {med.descripcionMed} - {med.Presentacion || 'N/A'}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group className="mb-3">
                      <Form.Label>Cantidad</Form.Label>
                      <Form.Control
                        type="number"
                        name="cantidad"
                        value={nuevoDetalle.cantidad}
                        onChange={handleNuevoDetalleChange}
                        min="1"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group className="mb-3">
                      <Form.Label>Precio</Form.Label>
                      <Form.Control
                        type="number"
                        name="precio"
                        value={nuevoDetalle.precio}
                        onChange={handleNuevoDetalleChange}
                        step="0.01"
                        min="0"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4} className="d-flex align-items-end">
                    <Button onClick={agregarDetalle} className="mb-3 w-100">
                      Agregar Medicamento
                    </Button>
                  </Col>
                </Row>
                
                {medicamentoSeleccionado && (
                  <div className="mt-2">
                    <small className="text-muted">
                      Stock actual: {medicamentoSeleccionado.stock || 0} |
                      Precio de venta: S/ {typeof medicamentoSeleccionado.precioVentaUni === 'number' ? medicamentoSeleccionado.precioVentaUni.toFixed(2) : '0.00'}
                    </small>
                  </div>
                )}
              </Card.Body>
            </Card>
            
            {detalles.length > 0 ? (
              <Table striped bordered hover responsive className="mb-4">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Descripción</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Subtotal</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {detalles.map((detalle, index) => (
                    <tr key={index}>
                      <td>{detalle.CodMedicamento}</td>
                      <td>{detalle.descripcion}</td>
                      <td>{detalle.cantidad}</td>
                      <td>S/ {typeof detalle.precio === 'number' ? detalle.precio.toFixed(2) : detalle.precio}</td>
                      <td>S/ {(detalle.cantidad * detalle.precio).toFixed(2)}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => eliminarDetalle(index)}
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))}
                  <tr className="table-active">
                    <td colSpan="4" className="text-end"><strong>Total:</strong></td>
                    <td colSpan="2"><strong>S/ {calcularTotal()}</strong></td>
                  </tr>
                </tbody>
              </Table>
            ) : (
              <Alert variant="warning" className="mb-4">
                No hay medicamentos agregados a la orden.
              </Alert>
            )}
            
            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={() => navigate('/ordenes-compra')}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  isEditMode ? 'Actualizar Orden' : 'Guardar Orden'
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OrdenCompraForm;