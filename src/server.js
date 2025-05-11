const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
require('dotenv').config();

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const laboratorioRoutes = require('./routes/laboratorio.routes');
const medicamentoRoutes = require('./routes/medicamento.routes');
const ordenCompraRoutes = require('./routes/ordenCompra.routes');
const detalleOrdenCompraRoutes = require('./routes/detalleOrdenCompra.routes');
const roleRoutes = require('./routes/role.routes');

const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const laboratorioRoutes = require('./routes/laboratorio.routes');
const medicamentoRoutes = require('./routes/medicamento.routes');
const ordenCompraRoutes = require('./routes/ordenCompra.routes');
const detalleOrdenCompraRoutes = require('./routes/detalleOrdenCompra.routes');
const roleRoutes = require('./routes/role.routes');

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/laboratorios', laboratorioRoutes);
app.use('/api/medicamentos', medicamentoRoutes);
app.use('/api/ordenes-compra', ordenCompraRoutes);
app.use('/api/detalle-ordenes-compra', detalleOrdenCompraRoutes);
app.use('/api/roles', roleRoutes);

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'client/build')));

// Ruta para el frontend (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Puerto
const PORT = process.env.PORT || 8080;

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
  
  try {
    await sequelize.sync({ force: false });
    console.log('Base de datos sincronizada correctamente');
  } catch (error) {
    console.error('Error al sincronizar la base de datos:', error);
  }
});
