const { Usuario, Laboratorio, Medicamento, OrdenCompra, DetalleOrdenCompra } = require('../models');
const bcrypt = require('bcryptjs');

async function seed() {
  try {
    // Crear usuarios de prueba
    const usuarios = [
      {
        username: 'admin',
        email: 'admin@farmacia.com',
        password: await bcrypt.hash('admin123', 10),
        rol: 'admin'
      },
      {
        username: 'moderador',
        email: 'moderador@farmacia.com',
        password: await bcrypt.hash('mod123', 10),
        rol: 'moderador'
      },
      {
        username: 'usuario',
        email: 'usuario@farmacia.com',
        password: await bcrypt.hash('user123', 10),
        rol: 'usuario'
      }
    ];
    
    await Usuario.bulkCreate(usuarios);
    console.log('Usuarios creados correctamente');
    
    // Crear laboratorios de prueba
    const laboratorios = [
      {
        CodLab: 'LAB001',
        razonSocial: 'Laboratorios MediPharma',
        direccion: 'Av. Principal 123',
        email: 'contacto@medipharma.com',
        telefono: '555-1234',
        contacto: 'Juan Pérez'
      },
      {
        CodLab: 'LAB002',
        razonSocial: 'Farmacéutica VitaSalud',
        direccion: 'Calle Secundaria 456',
        email: 'info@vitasalud.com',
        telefono: '555-5678',
        contacto: 'María Rodríguez'
      },
      {
        CodLab: 'LAB003',
        razonSocial: 'Bayer Perú',
        direccion: 'Av. Industrial 789',
        email: 'ventas@bayer.pe',
        telefono: '555-9012',
        contacto: 'Carlos López'
      }
    ];
    
    await Laboratorio.bulkCreate(laboratorios);
    console.log('Laboratorios creados correctamente');
    
    // Crear medicamentos de prueba
    const medicamentos = [
      {
        CodMedicamento: 'MED001',
        descripcionMed: 'Paracetamol 500mg',
        fechaFabricacion: new Date('2023-01-15'),
        fechaVencimiento: new Date('2025-01-15'),
        Presentacion: 'Tabletas',
        stock: 100,
        precioVentaUni: 0.5,
        precioVentaPres: 15.0,
        CodTipoMed: 'ANALG',
        Marca: 'GeneriMed',
        CodEspec: 'ESP001'
      },
      {
        CodMedicamento: 'MED002',
        descripcionMed: 'Ibuprofeno 400mg',
        fechaFabricacion: new Date('2023-02-20'),
        fechaVencimiento: new Date('2025-02-20'),
        Presentacion: 'Tabletas',
        stock: 80,
        precioVentaUni: 0.6,
        precioVentaPres: 18.0,
        CodTipoMed: 'ANALG',
        Marca: 'MediPain',
        CodEspec: 'ESP001'
      },
      {
        CodMedicamento: 'MED003',
        descripcionMed: 'Amoxicilina 500mg',
        fechaFabricacion: new Date('2023-03-10'),
        fechaVencimiento: new Date('2025-03-10'),
        Presentacion: 'Cápsulas',
        stock: 50,
        precioVentaUni: 0.8,
        precioVentaPres: 24.0,
        CodTipoMed: 'ANTIB',
        Marca: 'BactiCure',
        CodEspec: 'ESP002'
      },
      {
        CodMedicamento: 'MED004',
        descripcionMed: 'Loratadina 10mg',
        fechaFabricacion: new Date('2023-04-05'),
        fechaVencimiento: new Date('2025-04-05'),
        Presentacion: 'Tabletas',
        stock: 70,
        precioVentaUni: 0.7,
        precioVentaPres: 20.0,
        CodTipoMed: 'ANTIH',
        Marca: 'AllerFree',
        CodEspec: 'ESP003'
      }
    ];
    
    await Medicamento.bulkCreate(medicamentos);
    console.log('Medicamentos creados correctamente');
    
    // Crear órdenes de compra de prueba
    const ordenesCompra = [
      {
        NroOrdenC: 'OC001',
        fechaEmision: new Date('2023-05-10'),
        Situacion: 'Completada',
        NroFacturaProv: 'F-12345',
        CodLab: 'LAB001'
      },
      {
        NroOrdenC: 'OC002',
        fechaEmision: new Date('2023-06-15'),
        Situacion: 'Pendiente',
        NroFacturaProv: 'F-12346',
        CodLab: 'LAB002'
      }
    ];
    
    await OrdenCompra.bulkCreate(ordenesCompra);
    console.log('Órdenes de compra creadas correctamente');
    
    // Crear detalles de órdenes de compra de prueba
    const detallesOrdenCompra = [
      {
        NroOrdenC: 'OC001',
        CodMedicamento: 'MED001',
        descripcion: 'Paracetamol 500mg - Tabletas',
        cantidad: 50,
        precio: 0.4
      },
      {
        NroOrdenC: 'OC001',
        CodMedicamento: 'MED002',
        descripcion: 'Ibuprofeno 400mg - Tabletas',
        cantidad: 30,
        precio: 0.5
      },
      {
        NroOrdenC: 'OC002',
        CodMedicamento: 'MED003',
        descripcion: 'Amoxicilina 500mg - Cápsulas',
        cantidad: 40,
        precio: 0.7
      },
      {
        NroOrdenC: 'OC002',
        CodMedicamento: 'MED004',
        descripcion: 'Loratadina 10mg - Tabletas',
        cantidad: 35,
        precio: 0.6
      }
    ];
    
    await DetalleOrdenCompra.bulkCreate(detallesOrdenCompra);
    console.log('Detalles de órdenes de compra creados correctamente');
    
    console.log('Base de datos sembrada exitosamente');
  } catch (error) {
    console.error('Error al sembrar la base de datos:', error.message);
  }
}

module.exports = seed;