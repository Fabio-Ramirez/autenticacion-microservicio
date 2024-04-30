import express from 'express';
import responseTime from 'response-time';
import cors from 'cors';
//import body-parser from 'body-parser'
import authRouter from './routes/authRouter.js';


const app = express();

// Configurar middlewares
app.use(express.json());
app.use(responseTime());

// Habilitar CORS
app.use(cors());

// Configurar rutas
app.use('/autenticacion', authRouter);

export default app 