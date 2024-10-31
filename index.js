import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './app/router/router.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  const name = process.env.NAME || 'Minka';
  res.send(`¡Hola ${name}! El servidor está funcionando correctamente.`);
});

app.use('/api', router);

const port = parseInt(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}. La aplicación ha arrancado correctamente.`);
});