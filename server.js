// Importar rutas
const authRoutes = require('./src/routes/auth.routes');
const laboratorioRoutes = require('./src/routes/laboratorio.routes');
const medicamentoRoutes = require('./src/routes/medicamento.routes');
const ordenCompraRoutes = require('./src/routes/ordenCompra.routes');
const detalleOrdenCompraRoutes = require('./src/routes/detalleOrdenCompra.routes');
const roleRoutes = require('./src/routes/role.routes');

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
