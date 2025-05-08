import express from 'express';
import apiController from '../controllers/apiController.js';

const router = express.Router();

// Ruta principal
router.get('/', apiController.getRoot);

router.post('/chat', apiController.postChat);

router.get('/hola', (req, res) => {
  res.send('hola mundo');
});

export default router;
