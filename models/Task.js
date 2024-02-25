const mongoose = require('mongoose');
const SubTask = require('./SubTask');



console.log(SubTask);
const taskSchema = new mongoose.Schema ({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['TODO', 'IN_PROGRESS', 'DONE'],
        default: 'TODO'
    },
    due_date: {
        type: Date,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    deleted_at: {
        type: Date,
        default: null
    },
    priority: {
        type: Number,
        enum: [0, 1, 2, 3],
        default: 0
    },
    subTasks: [SubTask.schema] 
   
});

module.exports = mongoose.model('Task', taskSchema);
