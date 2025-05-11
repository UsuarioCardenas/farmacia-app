import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, ProgressBar, Button } from 'react-bootstrap';
import MedicamentoService from '../../services/medicamento.service';
import LaboratorioService from '../../services/laboratorio.service';
import OrdenCompraService from '../../services/ordenCompra.service';
import AuthService from '../../services/auth.service';

const ReportView = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalMedicamentos: 0,
    totalLaboratorios: 0,
    totalOrdenes: 0,
    medicamentosBajoStock: [],
    medicamentosProximosVencer: [],
    ordenesRecientes: [],
    resumenOrdenes: {
      pendientes: 0,
      completadas: 0,
      canceladas: 0
    }
  });
  
  const currentUser = AuthService.getCurrentUser();
  
  useEffect(() => {
    if (currentUser && (currentUser.rol === 'admin' || currentUser.rol === 'moderador')) {
      fetchData();
    } else {
      setError('No tienes permisos para acceder a esta página');
      setLoading(false);
    }
  }, []);
  
  const fetchData = async () => {
    try {
      const [medicamentosRes, laboratoriosRes, ordenesRes] = await Promise.all([
        MedicamentoService.getAll(),
        LaboratorioService.getAll(),
        OrdenCompraService.getAll()
      ]);
      
      const medicamentos = medicamentosRes.data;
      const laboratorios = laboratoriosRes.data;
      const ordenes = ordenesRes.data;
      
      // Medicamentos con stock bajo (menos de 10 unidades)
      const medicamentosBajoStock = medicamentos
        .filter(med => med.stock < 10)
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 5);
      
      // Medicamentos próximos a vencer (en los próximos 90 días)
      const today = new Date();
      const ninetyDaysFromNow = new Date(today);
      ninetyDaysFromNow.setDate(today.getDate() + 90);
      
      const medicamentosProximosVencer = medicamentos
        .filter(med => {
          if (!med.fechaVencimiento) return false;
          const vencimiento = new Date(med.fechaVencimiento);
          return vencimiento > today && vencimiento <= ninetyDaysFromNow;
        })
        .sort((a, b) => new Date(a.fechaVencimiento) - new Date(b.fechaVencimiento))
        .slice(0, 5);
      
      // Órdenes recientes (últimas 5)
      const ordenesRecientes = ordenes
        .sort((a, b) => new Date(b.fechaEmision) - new Date(a.fechaEmision))
        .slice(0, 5);
      
      // Resumen de órdenes por situación
      const resumenOrdenes = {
        pendientes: ordenes.filter(orden => orden.Situacion === 'Pendiente').length,
        completadas: ordenes.filter(orden => orden.Situacion === 'Completada').length,
        canceladas: ordenes.filter(orden => orden.Situacion === 'Cancelada').length
      };
      
      setStats({
        totalMedicamentos: medicamentos.length,
        totalLaboratorios: laboratorios.length,
        totalOrdenes: ordenes.length,
        medicamentosBajoStock,
        medicamentosProximosVencer,
        ordenesRecientes,
        resumenOrdenes
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error al obtener datos para el reporte:', err);
      setError(`Error al cargar los datos del reporte: ${err.message}`);
      setLoading(false);
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
      </Container>
    );
  }
  
  return (
    <Container className="mt-4">
      <h2 className="mb-4">Reportes y Estadísticas</h2>
      
      <Row className="mb-4">
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <h5>Medicamentos</h5>
              <div className="display-4 my-3">{stats.totalMedicamentos}</div>
              <div className="text-muted">Total de medicamentos registrados</div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <h5>Laboratorios</h5>
              <div className="display-4 my-3">{stats.totalLaboratorios}</div>
              <div className="text-muted">Total de laboratorios registrados</div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <h5>Órdenes de Compra</h5>
              <div className="display-4 my-3">{stats.totalOrdenes}</div>
              <div className="text-muted">Total de órdenes registradas</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header>
              <h5 className="mb-0">Estado de Órdenes de Compra</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={8}>
                  <div className="mb-3">
                    <div className="mb-2">Pendientes ({stats.resumenOrdenes.pendientes})</div>
                    <ProgressBar 
                      variant="warning" 
                      now={stats.totalOrdenes ? (stats.resumenOrdenes.pendientes / stats.totalOrdenes * 100) : 0} 
                      className="mb-3"
                    />
                    
                    <div className="mb-2">Completadas ({stats.resumenOrdenes.completadas})</div>
                    <ProgressBar 
                      variant="success" 
                      now={stats.totalOrdenes ? (stats.resumenOrdenes.completadas / stats.totalOrdenes * 100) : 0} 
                      className="mb-3"
                    />
                    
                    <div className="mb-2">Canceladas ({stats.resumenOrdenes.canceladas})</div>
                    <ProgressBar 
                      variant="danger" 
                      now={stats.totalOrdenes ? (stats.resumenOrdenes.canceladas / stats.totalOrdenes * 100) : 0} 
                      className="mb-3"
                    />
                  </div>
                </Col>
                <Col md={4} className="d-flex align-items-center justify-content-center">
                  <div className="text-center">
                    <div className="display-5 mb-2">{stats.totalOrdenes}</div>
                    <div>Órdenes Totales</div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Medicamentos con Bajo Stock</h5>
              <Button variant="outline-primary" size="sm" href="/medicamentos">Ver Todos</Button>
            </Card.Header>
            <Card.Body>
              {stats.medicamentosBajoStock.length > 0 ? (
                <Table striped hover>
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Descripción</th>
                      <th>Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.medicamentosBajoStock.map(med => (
                      <tr key={med.CodMedicamento}>
                        <td>{med.CodMedicamento}</td>
                        <td>{med.descripcionMed}</td>
                        <td>
                          <span className={`${med.stock < 5 ? 'text-danger' : 'text-warning'} fw-bold`}>
                            {med.stock}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center text-muted py-4">
                  No hay medicamentos con bajo stock
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Medicamentos Próximos a Vencer</h5>
              <Button variant="outline-primary" size="sm" href="/medicamentos">Ver Todos</Button>
            </Card.Header>
            <Card.Body>
              {stats.medicamentosProximosVencer.length > 0 ? (
                <Table striped hover>
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Descripción</th>
                      <th>Vencimiento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.medicamentosProximosVencer.map(med => (
                      <tr key={med.CodMedicamento}>
                        <td>{med.CodMedicamento}</td>
                        <td>{med.descripcionMed}</td>
                        <td>
                          {new Date(med.fechaVencimiento).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center text-muted py-4">
                  No hay medicamentos próximos a vencer
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Órdenes de Compra Recientes</h5>
              <Button variant="outline-primary" size="sm" href="/ordenes-compra">Ver Todas</Button>
            </Card.Header>
            <Card.Body>
              {stats.ordenesRecientes.length > 0 ? (
                <Table striped hover>
                  <thead>
                    <tr>
                      <th>Número</th>
                      <th>Fecha</th>
                      <th>Laboratorio</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.ordenesRecientes.map(orden => (
                      <tr key={orden.NroOrdenC}>
                        <td>
                          <a href={`/ordenes-compra/${orden.NroOrdenC}`}>
                            {orden.NroOrdenC}
                          </a>
                        </td>
                        <td>{new Date(orden.fechaEmision).toLocaleDateString()}</td>
                        <td>{orden.Laboratorio?.razonSocial || 'N/A'}</td>
                        <td>
                          {orden.Situacion === 'Pendiente' && <span className="text-warning">Pendiente</span>}
                          {orden.Situacion === 'Completada' && <span className="text-success">Completada</span>}
                          {orden.Situacion === 'Cancelada' && <span className="text-danger">Cancelada</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center text-muted py-4">
                  No hay órdenes recientes
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ReportView;