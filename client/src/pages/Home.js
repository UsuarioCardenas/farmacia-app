import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} className="text-center">
          <h1 className="mb-4">Sistema de Gestión de Farmacia</h1>
          <p className="lead mb-4">
            Bienvenido al sistema de gestión de farmacia. Esta plataforma le permite administrar medicamentos, 
            laboratorios y órdenes de compra de manera eficiente.
          </p>
          <div className="d-grid gap-2 d-md-flex justify-content-md-center">
            <Button as={Link} to="/login" variant="primary" size="lg" className="me-md-2 mb-2">
              Iniciar Sesión
            </Button>
            <Button as={Link} to="/register" variant="outline-primary" size="lg" className="mb-2">
              Registrarse
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <i className="bi bi-capsule fs-1 mb-3 text-primary"></i>
              <Card.Title>Gestión de Medicamentos</Card.Title>
              <Card.Text>
                Administre el inventario de medicamentos, incluyendo información detallada sobre presentación, 
                precios y stock disponible.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <i className="bi bi-building fs-1 mb-3 text-primary"></i>
              <Card.Title>Gestión de Laboratorios</Card.Title>
              <Card.Text>
                Mantenga un registro de todos los laboratorios proveedores, con su información de contacto 
                y productos asociados.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <i className="bi bi-cart-check fs-1 mb-3 text-primary"></i>
              <Card.Title>Órdenes de Compra</Card.Title>
              <Card.Text>
                Cree y administre órdenes de compra a laboratorios, llevando un control detallado de 
                todos los medicamentos solicitados.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;