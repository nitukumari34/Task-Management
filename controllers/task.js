
const Task = require('../models/Task');

exports.createTask = async (req, res, next) => {

    try {

        const { title, description, due_date, subTasks } = req.body;

        console.log('INPUT', title, description, due_date, subTasks);

        console.log('SUB task', subTasks);
        const existing_task = await Task.findOne({ title: title, description: description });
        // console.log('EXISTING', existing_task)
        console.log('SUB task', subTasks);

        if (existing_task) {
            return res.status(400).json({
                message: "Task already exists"
            })
        }

        console.log('SUB task', subTasks);

        const newTask = new Task({
            title,
            description,
            due_date,
            subTasks: subTasks
        })

        console.log('NEW TASK', newTask);

        try {
            await newTask.save();
            res.status(200).json({
                status: 'success',
                message: "Task created successfully",
                data: newTask
            });
        } catch (error) {

            res.status(500).json({
                status: 'error',
                message: "Error saving task"
            });
        }


    } catch (err) {

        res.status(500).json({
            status: 'error',
            message: "Something went wrong!",
        });
    }
}


exports.updateTask = async (req, res, next) => {

    try {

        const { task_id, due_date, status } = req.body;

        const existing_task = await Task.findById(task_id);

        if (!existing_task) {
            return res.status(400).json({
                message: "Task does not exists"
            })
        }

        if (due_date !== undefined) {
            existing_task.due_date = due_date
        }

        if (status !== undefined && (status === 'TODO' || status === 'DONE')) {
            existing_task.status = status
        }

        await existing_task.save();

        res.status(200).json({
            status: 'success',
            message: "Task updated successfully",
            data: existing_task
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: "Something went wrong!",
        });
    }
}

exports.getAllUserTask = async (req, res, next) => {
    try {

        const { priority, due_date, page = 1, limit = 10 } = req.body;

        const query = {};
        if (priority) query.priority = priority;
        if (due_date) query.due_date = { $lte: new Date(due_date) };

        const totalTasks = await Task.countDocuments(query);
        console.log(totalTasks);

        const offset = (page - 1) * limit;
        const tasks = await Task.find(query).sort({ due_date: 1 }).skip(offset).limit(limit);
        console.log(tasks);

        res.status(200).json({
            status: 'success',
            message: "Task fetched successfully",
            data: {
                tasks,
                totalTasks,
                totalPages: Math.ceil(totalTasks / limit),
                currentPage: page
            }

        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: "Something went wrong!",
        })
    }
}

exports.getAllUserSubTask = async (req, res, next) => {

    try {

        const { task_id } = req.body;

        if (!task_id) {
            return res.status(400).json({
                message: "Task ID is required"
            })
        }
        const task = await Task.findById(task_id);

        if (!task) {
            return res.status(400).json({
                message: "Task does not exists"
            })
        }

        res.status(200).json({
            status: 'success',
            message: "Subtask fetched successfully",
            subTask: task.subTasks
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',

            message: "Something went wrong!",
        })
    }

}

exports.updateSubTask = async (req, res, next) => {

    try {

        const { task_id, subTask_id, status } = req.body;



        if (!task_id || !subTask_id || !status) {
            return res.status(400).json({
                message: "Missing Params"
            })
        }

        const task = await Task.findById(task_id);

        if (!task) {
            res.status(404).json({
                message: "Task does not exists"
            })
        }

        const subTask = task.subTasks.find(sub => sub._id.toString() === subTask_id);

        if (!subTask) {
            res.status(404).json({
                message: "SubTask does not exists"
            })
        }
        if (subTask.status != undefined && subTask.status === 0 || subTask.status === 1) {
            subTask.status = status;
        }
        await task.save();

        res.status(200).json({
            status: 'success',
            message: "Subtask updated successfully",
            subTask: subTask
        })
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: "Something went wrong!",
        })
    }
}

exports.softDeleteTask = async (req, res, next) => {

    try {

        const { task_id } = req.body;

        console.log(task_id);

        if (!task_id) {
            return res.status(400).json({
                message: "Task ID is required"
            })
        }

        console.log("This passed")

        const task = await Task.findById(task_id);
        console.log(task);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        task.deleted_at = new Date();

        console.log("Passed2")
        await task.save();
        console.log("Saved");

        res.status(200).json({
            status: 'success',
            message: "Task deleted successfully"
        });

    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: "Something went wrong!",
        })
    }
}


exports.softDeleteSubTask = async (req, res, next) => {

    try {

        const { task_id, subTask_id } = req.body;


        if (!task_id || !subTask_id) {
            return res.status(400).json({
                message: "Task ID and SubTask ID is required"
            })
        }

        const task = await Task.findById(task_id);
        if (!task) {
            res.status(404).json({
                message: "Task does not exists"
            })
        }

        const subTask = task.subTasks.find(sub => sub._id.toString() === subTask_id);
        if (!subTask) {
            res.status(404).json({
                message: "SubTask does not exists"
            })
        }

        subTask.deleted_at = new Date();
        await task.save();

        res.status(200).json({
            status: 'success',
            message: "Subtask deleted successfully"
        })

    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: "Something went wrong!",
        })
    }
}