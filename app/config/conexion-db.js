import { Sequelize } from "sequelize";
import { config } from "./config.js";

let conexiondb;

if (config.dbUrl && config.dbUrl.trim() !== '') {
  // Conexión remota usando la URL completa de PostgreSQL
  conexiondb = new Sequelize(config.dbUrl, {
    dialect: 'postgres',
    logging: false,
  });
} else {
  // Conexión local usando variables de entorno individuales
  conexiondb = new Sequelize(
    config.dbName,
    config.dbUser,
    config.dbPassword,
    {
      host: config.dbHost,
      port: config.dbPort,
      dialect: 'postgres',
      logging: false,
    }
  );
}

/* conexiondb.sync()
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch((error) => {
    console.error('Unable to create database & tables:', error);
  }); */

conexiondb.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida correctamente.');
    return conexiondb.sync();
  })
  .then(() => {
    console.log('Base de datos y tablas creadas correctamente.');
  })
  .catch((error) => {
    console.error('No se pudo establecer la conexión a la base de datos:', error);
  });

export default conexiondb;