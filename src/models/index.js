const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite'),
  logging: false,
});

// MODELOS BÁSICOS
const Usuario = sequelize.define('Usuario', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  rol: {
    type: Sequelize.ENUM('usuario_final', 'tecnico', 'administrador'),
    defaultValue: 'usuario_final',
  },
  departamento: Sequelize.STRING,
  estado: {
    type: Sequelize.STRING,
    defaultValue: 'activo',
  },
}, {
  timestamps: true,
  tableName: 'usuarios',
});

const Ticket = sequelize.define('Ticket', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  numero: {
    type: Sequelize.STRING,
    unique: true,
  },
  titulo: Sequelize.STRING,
  descripcion: Sequelize.TEXT,
  categoria: Sequelize.STRING,
  estado: {
    type: Sequelize.STRING,
    defaultValue: 'abierto',
  },
  prioridad: {
    type: Sequelize.STRING,
    defaultValue: 'media',
  },
}, {
  timestamps: true,
  tableName: 'tickets',
});

// Relaciones
Usuario.hasMany(Ticket, { foreignKey: 'usuario_reportante_id' });
Ticket.belongsTo(Usuario, { foreignKey: 'usuario_reportante_id', as: 'usuarioReportante' });

module.exports = {
  sequelize,
  Sequelize,
  Usuario,
  Ticket,
};