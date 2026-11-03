const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/', historyController.getHistory);

module.exports = router;
