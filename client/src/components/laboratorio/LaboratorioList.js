import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import LaboratorioService from '../../services/laboratorio.service';
import AuthService from '../../services/auth.service';

const LaboratorioList = () => {
  const [laboratorios, setLaboratorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }

    fetchLaboratorios();
  }, []);

  const fetchLaboratorios = () => {
    LaboratorioService.getAll()
      .then((response) => {
        setLaboratorios(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al cargar los laboratorios:', error);
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Está seguro de eliminar este laboratorio?')) {
      LaboratorioService.delete(id)
        .then(() => {
          fetchLaboratorios();
        })
        .catch((error) => {
          console.error('Error al eliminar el laboratorio:', error);
        });
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredLaboratorios = laboratorios.filter((lab) =>
    lab.razonSocial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lab.CodLab?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h2>Lista de Laboratorios</h2>
        </Col>
        <Col xs="auto">
          {currentUser && (currentUser.rol === 'admin' || currentUser.rol === 'moderador') && (
            <Button as={Link} to="/laboratorios/nuevo" variant="primary">
              Nuevo Laboratorio
            </Button>
          )}
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              placeholder="Buscar laboratorios..."
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
            <th>Código</th>
            <th>Razón Social</th>
            <th>Dirección</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Contacto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredLaboratorios.length > 0 ? (
            filteredLaboratorios.map((laboratorio) => (
              <tr key={laboratorio.CodLab}>
                <td>{laboratorio.CodLab}</td>
                <td>{laboratorio.razonSocial}</td>
                <td>{laboratorio.direccion}</td>
                <td>{laboratorio.email}</td>
                <td>{laboratorio.telefono}</td>
                <td>{laboratorio.contacto}</td>
                <td>
                  <Button
                    as={Link}
                    to={`/laboratorios/${laboratorio.CodLab}`}
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
                        to={`/laboratorios/editar/${laboratorio.CodLab}`}
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
                          onClick={() => handleDelete(laboratorio.CodLab)}
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
              <td colSpan="7" className="text-center">
                No se encontraron laboratorios
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default LaboratorioList;