import express from 'express';
import mercadopago from 'mercadopago';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Configurar Mercado Pago
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN
});

router.post('/create_preference', protect, async (req, res) => {
  try {
    const preference = {
      items: [
        {
          title: 'Consulta Flebología Online',
          unit_price: 50,
          quantity: 1,
          currency_id: 'ARS'
        }
      ],
      back_urls: {
        success: 'http://localhost:5173/chat',
        failure: 'http://localhost:5173/fallo',
      },
      auto_return: 'approved'
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ init_point: response.body.init_point });

  } catch (err) {
    res.status(500).json({ msg: 'Error al crear la preferencia', error: err.message });
  }
});

export default router;
