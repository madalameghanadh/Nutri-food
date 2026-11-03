const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/', healthController.getHealthProfile);
router.put('/', healthController.updateHealthProfile);
router.post('/bmi', healthController.saveBmi);

module.exports = router;
