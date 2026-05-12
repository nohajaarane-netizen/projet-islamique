/**
 * Routes Index
 * Aggregates all API routes
 */

import { Router } from 'express';
import authRoutes from './auth.routes';
import prayerTimeRoutes from './prayer-time.routes';
import trackerRoutes from './tracker.routes';
import asmaulhusnaRoutes from './asmaulhusna.routes';
import contentRoutes from './content.routes';
import gratitudeRoutes from './gratitude.routes';
import dhikrRoutes from './dhikr.routes';
import favoriteRoutes from './favorite.routes';
import qiblaRoutes from './qibla.routes';
import weatherRoutes from './weather.routes';

const router = Router();

// Mount all routes under /api/v1
router.use('/auth', authRoutes);
router.use('/prayer-times', prayerTimeRoutes);
router.use('/tracker', trackerRoutes);
router.use('/asmaulhusna', asmaulhusnaRoutes);
router.use('/content', contentRoutes);
router.use('/gratitude', gratitudeRoutes);
router.use('/dhikr', dhikrRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/qibla', qiblaRoutes);
router.use('/weather', weatherRoutes);

export default router;
