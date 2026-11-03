const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/', recommendationController.getRecommendations);
router.post('/generate', recommendationController.generateRecommendations);

module.exports = router;
