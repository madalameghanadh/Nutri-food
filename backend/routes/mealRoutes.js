const express = require('express');
const router = express.Router();
const mealController = require('../controllers/mealController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/', mealController.getMealPlan);
router.post('/', mealController.saveMealPlan);
router.put('/:id', mealController.updateMealPlan);
router.delete('/:id', mealController.deleteMealPlan);

module.exports = router;
