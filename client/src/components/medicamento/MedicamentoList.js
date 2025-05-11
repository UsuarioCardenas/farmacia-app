import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import MedicamentoService from '../../services/medicamento.service';
import AuthService from '../../services/auth.service';

const MedicamentoList = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }

    fetchMedicamentos();
  }, []);

  const fetchMedicamentos = () => {
    MedicamentoService.getAll()
      .then((response) => {
        setMedicamentos(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al cargar los medicamentos:', error);
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Está seguro de eliminar este medicamento?')) {
      MedicamentoService.delete(id)
        .then(() => {
          fetchMedicamentos();
        })
        .catch((error) => {
          console.error('Error al eliminar el medicamento:', error);
        });
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredMedicamentos = medicamentos.filter((med) =>
    med.descripcionMed.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.CodMedicamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.Marca?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h2>Lista de Medicamentos</h2>
        </Col>
        <Col xs="auto">
          {currentUser && (currentUser.rol === 'admin' || currentUser.rol === 'moderador') && (
            <Button as={Link} to="/medicamentos/nuevo" variant="primary">
              Nuevo Medicamento
            </Button>
          )}
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              placeholder="Buscar medicamentos..."
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
            <th>Descripción</th>
            <th>Presentación</th>
            <th>Marca</th>
            <th>Stock</th>
            <th>Precio Unitario</th>
            <th>Vencimiento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredMedicamentos.length > 0 ? (
            filteredMedicamentos.map((medicamento) => (
              <tr key={medicamento.CodMedicamento}>
                <td>{medicamento.CodMedicamento}</td>
                <td>{medicamento.descripcionMed}</td>
                <td>{medicamento.Presentacion}</td>
                <td>{medicamento.Marca}</td>
                <td>{medicamento.stock}</td>
<td>S/ {typeof medicamento.precioVentaUni === 'number' ? medicamento.precioVentaUni.toFixed(2) : '0.00'}</td>
                <td>
                  {medicamento.fechaVencimiento ? new Date(medicamento.fechaVencimiento).toLocaleDateString() : 'N/A'}
                </td>

                <td>
                  <Button
                    as={Link}
                    to={`/medicamentos/${medicamento.CodMedicamento}`}
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
                        to={`/medicamentos/editar/${medicamento.CodMedicamento}`}
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
                          onClick={() => handleDelete(medicamento.CodMedicamento)}
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
              <td colSpan="8" className="text-center">
                No se encontraron medicamentos
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default MedicamentoList;