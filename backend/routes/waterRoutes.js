const express = require('express');
const router = express.Router();
const waterController = require('../controllers/waterController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/today', waterController.getTodayWater);
router.get('/weekly', waterController.getWeeklyWater);
router.post('/', waterController.updateWater);
router.put('/', waterController.updateWater);

module.exports = router;
