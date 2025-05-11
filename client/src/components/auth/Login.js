import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AuthService from '../../services/auth.service';
import { Card, Container, Row, Col, Button, Alert } from 'react-bootstrap';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const initialValues = {
    username: '',
    password: ''
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('¡El nombre de usuario es obligatorio!'),
    password: Yup.string().required('¡La contraseña es obligatoria!')
  });

  const handleLogin = (formValue) => {
    const { username, password } = formValue;
    setMessage('');
    setLoading(true);

    AuthService.login(username, password)
      .then(() => {
        navigate('/dashboard');
        window.location.reload();
      })
      .catch((error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.mensaje) ||
          error.message ||
          error.toString();

        setLoading(false);
        setMessage(resMessage);
      });
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Header as="h5" className="text-center">Iniciar Sesión</Card.Header>
            <Card.Body>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleLogin}
              >
                {({ errors, touched }) => (
                  <Form>
                    <div className="form-group mb-3">
                      <label htmlFor="username">Usuario</label>
                      <Field
                        name="username"
                        type="text"
                        className={`form-control ${touched.username && errors.username ? 'is-invalid' : ''}`}
                      />
                      <ErrorMessage
                        name="username"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>

                    <div className="form-group mb-3">
                      <label htmlFor="password">Contraseña</label>
                      <Field
                        name="password"
                        type="password"
                        className={`form-control ${touched.password && errors.password ? 'is-invalid' : ''}`}
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="invalid-feedback"
                      />
                    </div>

                    {message && (
                      <Alert variant="danger" className="mb-3">
                        {message}
                      </Alert>
                    )}

                    <div className="d-grid gap-2">
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="spinner-border spinner-border-sm"></span>
                        ) : (
                          <span>Iniciar Sesión</span>
                        )}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </Card.Body>
            <Card.Footer className="text-center">
              <p className="mb-0">
                ¿No tienes una cuenta? <a href="/register">Regístrate</a>
              </p>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;