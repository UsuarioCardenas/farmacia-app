import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AuthService from '../../services/auth.service';
import { Card, Container, Row, Col, Button, Alert } from 'react-bootstrap';

const Register = () => {
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState('');

  const initialValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    rol: 'usuario'
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .test(
        'len',
        'El nombre de usuario debe tener entre 3 y 20 caracteres',
        (val) => val && val.length >= 3 && val.length <= 20
      )
      .required('¡Este campo es obligatorio!'),
    email: Yup.string()
      .email('Correo electrónico no válido')
      .required('¡Este campo es obligatorio!'),
    password: Yup.string()
      .test(
        'len',
        'La contraseña debe tener entre 6 y 40 caracteres',
        (val) => val && val.length >= 6 && val.length <= 40
      )
      .required('¡Este campo es obligatorio!'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
      .required('¡Este campo es obligatorio!')
  });

  const handleRegister = (formValue) => {
    const { username, email, password, rol } = formValue;

    setMessage('');
    setSuccessful(false);

    AuthService.register(username, email, password, rol)
      .then((response) => {
        setMessage(response.data.mensaje);
        setSuccessful(true);
      })
      .catch((error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.mensaje) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
        setSuccessful(false);
      });
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Header as="h5" className="text-center">Registro de Usuario</Card.Header>
            <Card.Body>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleRegister}
              >
                {({ errors, touched }) => (
                  <Form>
                    {!successful && (
                      <div>
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
                          <label htmlFor="email">Correo electrónico</label>
                          <Field
                            name="email"
                            type="email"
                            className={`form-control ${touched.email && errors.email ? 'is-invalid' : ''}`}
                          />
                          <ErrorMessage
                            name="email"
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

                        <div className="form-group mb-3">
                          <label htmlFor="confirmPassword">Confirmar contraseña</label>
                          <Field
                            name="confirmPassword"
                            type="password"
                            className={`form-control ${touched.confirmPassword && errors.confirmPassword ? 'is-invalid' : ''}`}
                          />
                          <ErrorMessage
                            name="confirmPassword"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>

                        <div className="d-grid gap-2">
                          <Button variant="primary" type="submit">
                            Registrarse
                          </Button>
                        </div>
                      </div>
                    )}

                    {message && (
                      <Alert variant={successful ? 'success' : 'danger'} className="mt-3">
                        {message}
                      </Alert>
                    )}
                  </Form>
                )}
              </Formik>
            </Card.Body>
            <Card.Footer className="text-center">
              <p className="mb-0">
                ¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a>
              </p>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;