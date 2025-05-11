import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Container, Row, Col, Form, InputGroup, Badge } from 'react-bootstrap';
import OrdenCompraService from '../../services/ordenCompra.service';
import AuthService from '../../services/auth.service';

const OrdenCompraList = () => {
  const [ordenesCompra, setOrdenesCompra] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }

    fetchOrdenesCompra();
  }, []);

  const fetchOrdenesCompra = () => {
    OrdenCompraService.getAll()
      .then((response) => {
        setOrdenesCompra(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al cargar las órdenes de compra:', error);
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Está seguro de eliminar esta orden de compra?')) {
      OrdenCompraService.delete(id)
        .then(() => {
          fetchOrdenesCompra();
        })
        .catch((error) => {
          console.error('Error al eliminar la orden de compra:', error);
        });
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
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

  const filteredOrdenesCompra = ordenesCompra.filter((orden) =>
    orden.NroOrdenC?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    orden.Laboratorio?.razonSocial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    orden.Situacion?.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2>Lista de Órdenes de Compra</h2>
        </Col>
        <Col xs="auto">
          {currentUser && (currentUser.rol === 'admin' || currentUser.rol === 'moderador') && (
            <Button as={Link} to="/ordenes-compra/nueva" variant="primary">
              Nueva Orden de Compra
            </Button>
          )}
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              placeholder="Buscar órdenes de compra..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <Button variant="outline-secondary">
              <i className="bi bi-search"></i>
            </Button>
          </InputGroup>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Número</th>
            <th>Fecha de Emisión</th>
            <th>Laboratorio</th>
            <th>Situación</th>
            <th>N° Factura</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrdenesCompra.length > 0 ? (
            filteredOrdenesCompra.map((orden) => (
              <tr key={orden.NroOrdenC}>
                <td>{orden.NroOrdenC}</td>
                <td>{new Date(orden.fechaEmision).toLocaleDateString()}</td>
                <td>{orden.Laboratorio?.razonSocial || 'N/A'}</td>
                <td>{getSituacionBadge(orden.Situacion)}</td>
                <td>{orden.NroFacturaProv || 'Pendiente'}</td>
                <td>
                  <Button
                    as={Link}
                    to={`/ordenes-compra/${orden.NroOrdenC}`}
                    variant="info"
                    size="sm"
                    className="me-2"
                  >
                    <i className="bi bi-eye"></i>
                  </Button>
                  
                  {currentUser && (currentUser.rol === 'admin' || currentUser.rol === 'moderador') && (
                    <>
                      <Button
                        as={Link}
                        to={`/ordenes-compra/editar/${orden.NroOrdenC}`}
                        variant="warning"
                        size="sm"
                        className="me-2"
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      
                      {currentUser.rol === 'admin' && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(orden.NroOrdenC)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No se encontraron órdenes de compra
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default OrdenCompraList;