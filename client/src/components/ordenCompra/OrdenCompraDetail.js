// src/components/ordenCompra/OrdenCompraDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Card, Row, Col, Button, Table, Badge } from 'react-bootstrap';
import OrdenCompraService from '../../services/ordenCompra.service';
import AuthService from '../../services/auth.service';

const OrdenCompraDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ordenCompra, setOrdenCompra] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }

    OrdenCompraService.get(id)
      .then(response => {
        setOrdenCompra(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar la orden de compra:", err);
        setError("Error al cargar los datos de la orden de compra. " + (err.response?.data?.mensaje || err.message));
        setLoading(false);
      });
  }, [id]);

  const handleDelete = () => {
    if (window.confirm('¿Está seguro de eliminar esta orden de compra?')) {
      OrdenCompraService.delete(id)
        .then(() => {
          navigate('/ordenes-compra');
        })
        .catch(err => {
          console.error("Error al eliminar la orden de compra:", err);
          setError("Error al eliminar la orden de compra. " + (err.response?.data?.mensaje || err.message));
        });
    }
  };

  const getSituacionBadge = (situacion) => {
    switch (situacion) {
      case 'Pendiente':
        return <Badge bg="warning">Pendiente</Badge>;
      case 'Completada':
        return <Badge bg="success">Completada</Badge>;
      case 'Cancelada':
        return <Badge bg="danger">Cancelada</Badge>;
      default:
        return <Badge bg="secondary">{situacion}</Badge>;
    }
  };

  const calcularTotal = () => {
    if (!ordenCompra || !ordenCompra.DetalleOrdenCompras) return 0;
    
    return ordenCompra.DetalleOrdenCompras.reduce((total, detalle) => {
      return total + (detalle.cantidad * detalle.precio);
    }, 0).toFixed(2);
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
        <Button as={Link} to="/ordenes-compra" variant="primary">
          Volver a la lista
        </Button>
      </Container>
    );
  }

  if (!ordenCompra) {
    return (
      <Container className="mt-4">
        <div className="alert alert-warning">No se encontró la orden de compra solicitada.</div>
        <Button as={Link} to="/ordenes-compra" variant="primary">
          Volver a la lista
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card className="shadow-sm mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Orden de Compra #{ordenCompra.NroOrdenC}</h4>
          <div>
            <Button 
              as={Link} 
              to="/ordenes-compra" 
              variant="outline-secondary" 
              className="me-2"
            >
              Volver
            </Button>
            
            {currentUser && (currentUser.rol === 'admin' || currentUser.rol === 'moderador') && (
              <Button
                as={Link}
                to={`/ordenes-compra/editar/${id}`}
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
              <h5>Información de la Orden</h5>
              <Table bordered hover className="mb-4">
                <tbody>
                  <tr>
                    <th style={{ width: '40%' }}>Número de Orden</th>
                    <td>{ordenCompra.NroOrdenC}</td>
                  </tr>
                  <tr>
                    <th>Fecha de Emisión</th>
                    <td>{new Date(ordenCompra.fechaEmision).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <th>Situación</th>
                    <td>{getSituacionBadge(ordenCompra.Situacion)}</td>
                  </tr>
                  <tr>
                    <th>Factura Proveedor</th>
                    <td>{ordenCompra.NroFacturaProv || 'Pendiente'}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            
            <Col md={6}>
              <h5>Información del Laboratorio</h5>
              {ordenCompra.Laboratorio ? (
                <Table bordered hover className="mb-4">
                  <tbody>
                    <tr>
                      <th style={{ width: '40%' }}>Código</th>
                      <td>{ordenCompra.Laboratorio.CodLab}</td>
                    </tr>
                    <tr>
                      <th>Razón Social</th>
                      <td>{ordenCompra.Laboratorio.razonSocial}</td>
                    </tr>
                    <tr>
                      <th>Contacto</th>
                      <td>{ordenCompra.Laboratorio.contacto || 'No especificado'}</td>
                    </tr>
                    <tr>
                      <th>Teléfono</th>
                      <td>{ordenCompra.Laboratorio.telefono || 'No especificado'}</td>
                    </tr>
                  </tbody>
                </Table>
              ) : (
                <div className="alert alert-warning">
                  No se encontró información del laboratorio.
                </div>
              )}
            </Col>
          </Row>
          
          <h5>Detalle de Medicamentos</h5>
          {ordenCompra.DetalleOrdenCompras && ordenCompra.DetalleOrdenCompras.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Descripción</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {ordenCompra.DetalleOrdenCompras.map((detalle, index) => (
                  <tr key={index}>
                    <td>{detalle.CodMedicamento}</td>
                    <td>
                      {detalle.descripcion || 
                       (detalle.Medicamento ? detalle.Medicamento.descripcionMed : 'N/A')}
                    </td>
                    <td>{detalle.cantidad}</td>
                    <td>S/ {typeof detalle.precio === 'number' ? detalle.precio.toFixed(2) : detalle.precio}</td>
                    <td>S/ {(detalle.cantidad * detalle.precio).toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="table-active">
                  <td colSpan="4" className="text-end"><strong>Total:</strong></td>
                  <td><strong>S/ {calcularTotal()}</strong></td>
                </tr>
              </tbody>
            </Table>
          ) : (
            <div className="alert alert-warning">
              No hay medicamentos en esta orden de compra.
            </div>
          )}
        </Card.Body>
        
        <Card.Footer className="text-muted">
          <small>
            {ordenCompra.createdAt && (
              <>Creado: {new Date(ordenCompra.createdAt).toLocaleString()}</>
            )}
            {ordenCompra.updatedAt && ordenCompra.createdAt !== ordenCompra.updatedAt && (
              <> | Última actualización: {new Date(ordenCompra.updatedAt).toLocaleString()}</>
            )}
          </small>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default OrdenCompraDetail;