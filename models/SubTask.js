const mongoose = require('mongoose');

const subTaskSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    task_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
    },
    status: {
        type: Number,
        enum: [0, 1], 
        default: 0
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
    }
});

module.exports = mongoose.model('SubTask', subTaskSchema);
