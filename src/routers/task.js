const express = require('express');
const TaskDB = require('../models/task');
const auth = require('../middleware/auth');
const router = express.Router();

//basic endpoint
router.get('/task', (req, res)=>{
    res.send({"result": "Welcome to task-manager-api"});
});

//get all tasks
router.get('/task/all', auth, async (req, res)=>{
    
    try{
       // const tasks = await TaskDB.find({owner: req.user._id});
        await req.user.populate('tasks'); 
        const tasks = req.user.tasks;
        if(!tasks){
            return res.status(404).send({"result": "no task found"});
        }
        res.status(201).send(tasks);
    }
    catch(e){
        console.log(e);
        res.status(501).send();
    }
})

//get a task with a given id
router.get('/task/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try{
        const task = await TaskDB.findOne({_id, owner: req.user._id});
        if(!task){
            return res.status(404).send({"result": "no task found"});    
        }
        res.status(201).send({task});
    }
    catch(e){
        console.log(e);
        res.status(501).send({"error": "database error"});
    }
})

//create a new task
router.post('/task/new', auth, async (req, res)=>{
    
    try{
        const taskObj = req.body;
        const taskDoc = TaskDB({...taskObj, owner: req.user._id});
        await taskDoc.save();
        res.status(201).send({"result": taskDoc});
    }
    catch(e){
        res.status(501).send();
    }
});

//update the task with the given id
router.patch('/task/:id', auth, async (req, res)=>{
    const validUpdateKeys = ['title', 'isCompleted'];
    const _id = req.params.id;
    const updates = Object.keys(req.body);
    //console.log(updates);
    try{
       // console.log(updates);
        //const updatedTask = await TaskDB.findByIdAndUpdate(_id, updates); //updatedTask is the task prior to updates
        
        const task = await TaskDB.findOne({_id, owner: req.user._id});

        if(!task){
            return res.status(404).send({"result": "no task found"});
        }

        updates.forEach((update) => task[update] = req.body[update]);

        await task.save();
        res.status(201).send({"result": 'Update successful', task});
    }
    catch(e){
        console.log(e);
        res.status(501).send({"error": "database error"});
    }

});

router.delete('/task/:id', auth, async (req, res)=>{
    const _id = req.params.id;
    try{
        const taskRemoved = await TaskDB.findOneAndRemove({_id, owner: req.user._id});
        if(!taskRemoved){
            return res.status(404).send({"result": "No doc found of the given id"});
        }
        res.status(201).send({taskRemoved});
    }
    catch(e){
        console.log(e);
        res.status(501).send({"error": "database error"});
    }
})
//delete the task with the given id


module.exports = router;