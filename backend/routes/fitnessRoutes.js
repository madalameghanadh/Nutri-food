const express = require('express');
const router = express.Router();
const fitnessController = require('../controllers/fitnessController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/today', fitnessController.getTodayFitness);
router.get('/weekly', fitnessController.getWeeklyFitness);
router.post('/', fitnessController.updateFitness);
router.put('/', fitnessController.updateFitness);

module.exports = router;
