import { Router } from 'express';
import { WeatherController } from '../controllers/weather.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
const weatherController = new WeatherController();

// Routes
router.get('/', authMiddleware, weatherController.getUserWeather.bind(weatherController));
router.get('/coordinates', weatherController.getWeatherByCoords.bind(weatherController));
router.put('/location', authMiddleware, weatherController.updateLocation.bind(weatherController));

export default router;