import express from 'express';
import sequelize from './app/config/conexion-db.js'
import './app/modules/associations/associations.js'
import dotenv from 'dotenv';
import cors from 'cors';
import router from './app/router/router.js';
import cookieParser from 'cookie-parser';
import { errorResponse } from './app/middleware/api-response-handler.js';

dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:4200',  // URL de tu frontend
  credentials: true,  // Permite enviar cookies con las peticiones
}));

app.use(express.json());
app.use(cookieParser());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return errorResponse(res, 'JSON inválido');
  }
  next(err); 
});

app.get('/', (req, res) => {
  const name = process.env.NAME || 'Minka';
  res.send(`¡Hola ${name}! El servidor está funcionando correctamente.`);
});

app.get('/api/health', (req, res) => { 
  res.json({ message: 'La API está en buen estado' });
});

app.use('/api', router);

const port = parseInt(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}. La aplicación ha arrancado correctamente.`);
  console.log(process.env.NODE_ENV); 
});