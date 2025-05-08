import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import routes from './routes/index.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan('dev'));

// Montar las rutas bajo el prefijo /api
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});