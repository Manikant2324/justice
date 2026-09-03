const Task = require('../models/Task');

// @desc    Get Lawyer tasks
// @route   GET /api/tasks
// @access  Private (Lawyer)
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ lawyer: req.user._id })
      .populate('case', 'caseNumber title category')
      .sort({ dueDate: 1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create Task
// @route   POST /api/tasks
// @access  Private (Lawyer)
exports.createTask = async (req, res) => {
  try {
    const { caseId, title, dueDate, priority } = req.body;

    const task = await Task.create({
      case: caseId,
      lawyer: req.user._id,
      title,
      dueDate,
      priority: priority || 'Medium',
      status: 'Pending'
    });

    const populated = await Task.findById(task._id).populate('case', 'caseNumber title');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update / Toggle task status
// @route   PATCH /api/tasks/:id
// @access  Private (Lawyer)
exports.updateTask = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.status = status;
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
