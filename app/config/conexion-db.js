import { Sequelize } from "sequelize";
import { config } from "./config.js";

let sequelize;

if (config.dbUrl && config.dbUrl.trim() !== '') {
  // Conexión remota usando la URL completa de PostgreSQL
  sequelize = new Sequelize(config.dbUrl, {
    dialect: 'postgres',
    logging: false,
    timezone: '+00:00'
  });
} else {
  // Conexión local usando variables de entorno individuales
  sequelize = new Sequelize(
    config.dbName,
    config.dbUser,
    config.dbPassword,
    {
      host: config.dbHost,
      port: config.dbPort,
      dialect: 'postgres',
      logging: false,
      timezone: '+00:00'
    }
  );
}

sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida correctamente.');
    return sequelize.sync();
  })
  .then(() => {
    console.log('Base de datos y tablas creadas correctamente.');
  })
  .catch((error) => {
    console.error('No se pudo establecer la conexión a la base de datos:', error);
  });

export default sequelize;