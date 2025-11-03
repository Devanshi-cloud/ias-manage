const express = require("express");
const { protect, adminOnly, authorize } = require("../middlewares/authMiddleware");
const { getDashboardData, getUserDashboardData, getDepartmentDashboardData, getTasks, getTaskById, createTask, updateTask, deleteTask, updateTaskStatus, updateTaskChecklist } = require("../controllers/taskController");
const User = require('../models/User');
const Task = require('../models/Task');
const excelJS = require("exceljs"); // Import excelJS

const router = express.Router();

// Middleware to check if user is VP or Head
const isVPOrHead = (req, res, next) => {
  if (req.user.role !== 'vp' && req.user.role !== 'head') {
    return res.status(403).json({ message: 'Access denied. VP or Head role required.' });
  }
  next();
};

// Task Management Routes
router.get("/dashboard-data", protect, authorize(['admin']), getDashboardData);
router.get("/user-dashboard-data", protect, getUserDashboardData);
router.get("/department-dashboard-data", protect, authorize(['vp', 'head']), getDepartmentDashboardData);

router.get("/", protect, getTasks); // Get all tasks (Admin: all, User: assigned)
router.get("/:id", protect, getTaskById); // Get task by ID

router.post("/", protect, authorize(['admin', 'vp', 'head']), createTask); // Create a task (Admin, VP, Head)
router.put("/:id", protect, updateTask); // Update task details
router.delete("/:id", protect, authorize(['admin', 'vp', 'head']), deleteTask); // Delete a task (Admin, VP, Head)

router.put("/:id/status", protect, updateTaskStatus); // Update task status
router.put("/:id/todo", protect, updateTaskChecklist); // Update task checklist

// Department-specific routes
router.get('/department-tasks', protect, isVPOrHead, async (req, res) => {
  try {
    const userDepartment = req.user.department; 
    
    const departmentUsers = await User.find({ department: userDepartment }).select('_id');
    const userIds = departmentUsers.map(u => u._id);
    
    const tasks = await Task.find({
      $or: [
        { assignedTo: { $in: userIds } },
        { createdBy: req.user.id }
      ]
    })
    .populate('assignedTo', 'name email profileImageUrl')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });
    
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/department-users', protect, isVPOrHead, async (req, res) => {
  try {
    const userDepartment = req.user.department;
    
    const users = await User.find({ 
      department: userDepartment,
      _id: { $ne: req.user.id } 
    })
    .select('name email birthday iasPosition profileImageUrl department pendingTasks inProgressTasks completedTasks createdAt');
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/department-task', protect, isVPOrHead, async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignedTo, attachments, todoChecklist } = req.body;
    const userDepartment = req.user.department;
    
    const assignedUsers = await User.find({ _id: { $in: assignedTo } });
    const invalidUsers = assignedUsers.filter(u => u.department !== userDepartment);
    
    if (invalidUsers.length > 0) {
      return res.status(403).json({ 
        message: 'Cannot assign tasks to users outside your department' 
      });
    }
    
    const task = new Task({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      attachments,
      todoChecklist,
      createdBy: req.user.id,
      department: userDepartment, 
      status: 'Pending'
    });
    
    await task.save();
    await task.populate('assignedTo', 'name email profileImageUrl');
    
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/department-task/:id', protect, isVPOrHead, async (req, res) => {
  try {
    const userDepartment = req.user.department;
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    if (task.department !== userDepartment) {
      return res.status(403).json({ message: 'Cannot modify tasks outside your department' });
    }
    
    const { assignedTo } = req.body;
    
    if (assignedTo) {
      const assignedUsers = await User.find({ _id: { $in: assignedTo } });
      const invalidUsers = assignedUsers.filter(u => u.department !== userDepartment);
      
      if (invalidUsers.length > 0) {
        return res.status(403).json({ 
          message: 'Cannot assign tasks to users outside your department' 
        });
      }
    }
    
    Object.assign(task, req.body);
    await task.save();
    await task.populate('assignedTo', 'name email profileImageUrl');
    
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/department-task/:id', protect, isVPOrHead, async (req, res) => {
  try {
    const userDepartment = req.user.department;
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    
    if (task.department !== userDepartment) {
      return res.status(403).json({ message: 'Cannot delete tasks outside your department' });
    }
    
    await task.deleteOne();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Export department tasks
router.get('/export/department-tasks', protect, isVPOrHead, async (req, res) => {
  try {
    const userDepartment = req.user.department; 
    
    const departmentUsers = await User.find({ department: userDepartment }).select('_id');
    const userIds = departmentUsers.map(u => u._id);
    
    const tasks = await Task.find({
      $or: [
        { assignedTo: { $in: userIds } },
        { createdBy: req.user.id }
      ]
    })
    .populate('assignedTo', 'name email')
    .sort({ createdAt: -1 });

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Department Tasks Report");

    worksheet.columns = [
      { header: "Task ID", key: "_id", width: 25 },
      { header: "Title", key: "title", width: 30 },
      { header: "Description", key: "description", width: 50 },
      { header: "Priority", key: "priority", width: 15 },
      { header: "Status", key: "status", width: 20 },
      { header: "Due Date", key: "dueDate", width: 20 },
      { header: "Assigned To", key: "assignedTo", width: 35 },
    ];

    tasks.forEach((task) => {
      const assignedTo =
        Array.isArray(task.assignedTo) && task.assignedTo.length > 0
          ? task.assignedTo.map((user) => `${user.name} (${user.email})`).join(", ")
          : "Unassigned";

      worksheet.addRow({
        _id: task._id.toString(),
        title: task.title,
        description: task.description || "-",
        priority: task.priority || "-",
        status: task.status || "-",
        dueDate: task.dueDate ? task.dueDate.toISOString().split("T")[0] : "-",
        assignedTo,
      });
    });
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=department-tasks.xlsx');
    
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Export department users
router.get('/export/department-users', protect, isVPOrHead, async (req, res) => {
  try {
    const userDepartment = req.user.department;
    
    const users = await User.find({ 
      department: userDepartment 
    }).select("name email _id");

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Department Users Report");

    worksheet.columns = [
      { header: "User Name", key: "name", width: 30 },
      { header: "Email", key: "email", width: 40 },
    ];

    users.forEach((user) => {
      worksheet.addRow({
        name: user.name,
        email: user.email,
      });
    });
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=department-users.xlsx');
    
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;