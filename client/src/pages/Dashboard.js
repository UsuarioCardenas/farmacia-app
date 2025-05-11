import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import MedicamentoService from '../services/medicamento.service';
import LaboratorioService from '../services/laboratorio.service';
import OrdenCompraService from '../services/ordenCompra.service';
import AuthService from '../services/auth.service';

const Dashboard = () => {
  const [stats, setStats] = useState({
    medicamentos: 0,
    laboratorios: 0,
    ordenesCompra: 0
  });
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }

    const fetchStats = async () => {
      try {
        const [medicamentosRes, laboratoriosRes, ordenesCompraRes] = await Promise.all([
          MedicamentoService.getAll(),
          LaboratorioService.getAll(),
          OrdenCompraService.getAll()
        ]);

        setStats({
          medicamentos: medicamentosRes.data.length,
          laboratorios: laboratoriosRes.data.length,
          ordenesCompra: ordenesCompraRes.data.length
        });
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar las estadísticas:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
      <h2 className="mb-4">Panel de Control</h2>
      
      <Row>
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <Card.Title>Medicamentos</Card.Title>
              <div className="display-4 my-3">{stats.medicamentos}</div>
              <Card.Text>Total de medicamentos registrados en el sistema.</Card.Text>
              <Button as={Link} to="/medicamentos" variant="primary">
                Ver Medicamentos
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <Card.Title>Laboratorios</Card.Title>
              <div className="display-4 my-3">{stats.laboratorios}</div>
              <Card.Text>Total de laboratorios registrados en el sistema.</Card.Text>
              <Button as={Link} to="/laboratorios" variant="primary">
                Ver Laboratorios
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <Card.Title>Órdenes de Compra</Card.Title>
              <div className="display-4 my-3">{stats.ordenesCompra}</div>
              <Card.Text>Total de órdenes de compra registradas en el sistema.</Card.Text>
              <Button as={Link} to="/ordenes-compra" variant="primary">
                Ver Órdenes
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mt-4">
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Acciones Rápidas</Card.Title>
              <Row className="mt-3">
                {(currentUser && (currentUser.rol === 'admin' || currentUser.rol === 'moderador')) && (
                  <>
                    <Col md={3} className="mb-3">
                      <Button 
                        as={Link} 
                        to="/medicamentos/nuevo" 
                        variant="outline-primary" 
                        className="w-100"
                      >
                        Nuevo Medicamento
                      </Button>
                    </Col>
                    <Col md={3} className="mb-3">
                      <Button 
                        as={Link} 
                        to="/laboratorios/nuevo" 
                        variant="outline-primary" 
                        className="w-100"
                      >
                        Nuevo Laboratorio
                      </Button>
                    </Col>
                    <Col md={3} className="mb-3">
                      <Button 
                        as={Link} 
                        to="/ordenes-compra/nueva" 
                        variant="outline-primary" 
                        className="w-100"
                      >
                        Nueva Orden
                      </Button>
                    </Col>
                  </>
                )}
                <Col md={3} className="mb-3">
                  <Button 
                    as={Link} 
                    to="/perfil" 
                    variant="outline-secondary" 
                    className="w-100"
                  >
                    Mi Perfil
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;