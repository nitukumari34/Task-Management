const express = require('express');
const router = express.Router();
const  User = require('../controllers/UserController');
const Auth = require('../controllers/auth');
const Task = require('../controllers/task');

router.post('/register',Auth.registerUser);
router.post('/login',Auth.loginUser);
router.post('/createTask',Auth.protect, Task.createTask); 
router.post('/updateTask',Auth.protect, Task.updateTask);
router.post('/getAllUserTask', Auth.protect,Task.getAllUserTask);
router.post('/getAllSubtask',Auth.protect,Task.getAllUserSubTask)
router.post('/updateStatusSubtask',Auth.protect,Task.updateSubTask);
router.post('/deleteTask',Auth.protect,Task.softDeleteTask);
router.post('/deleteSubtask',Auth.protect,Task.softDeleteSubTask);

module.exports = router;