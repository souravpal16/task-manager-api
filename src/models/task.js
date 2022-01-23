const mongoose = require('mongoose');

const TaskSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    isCompleted:{
        type: Boolean,
        required: false,
        default: false,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

const TaskDB = mongoose.model('Task', TaskSchema);

module.exports = TaskDB;