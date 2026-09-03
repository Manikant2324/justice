const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask } = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', authorize('lawyer', 'admin'), getTasks);
router.post('/', authorize('lawyer', 'admin'), createTask);
router.patch('/:id', authorize('lawyer', 'admin'), updateTask);

module.exports = router;
