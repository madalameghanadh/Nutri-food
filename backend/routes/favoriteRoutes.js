const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/', favoriteController.getFavorites);
router.post('/:foodId', favoriteController.addFavorite);
router.delete('/:foodId', favoriteController.removeFavorite);

module.exports = router;
