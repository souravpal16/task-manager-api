const express = require('express');
const UserDB = require('../models/user');
// const { route } = require('./task');
const auth = require('../middleware/auth');
const router = express.Router();

//basic user route
router.get('/user', (req, res)=>{
    res.send({"result":"Welcome to user api"});
});

//create a new user
router.post('/user/new', async (req, res)=>{
    const user = req.body;
    try{
        const userCreated = UserDB(user);
        //res.send({userCreated});
        await userCreated.save();
        //res.send({"status": "running"});
        const token = await userCreated.generateAuthToken();
       res.status(200).send({user: userCreated, token});
    }
    catch(e){
        res.status(501).send({"error": "user not created", e});
    }
});

router.post('/user/login', async(req, res)=>{
    const email = req.body.email;
    const password = req.body.password;
    try{
        const user = await UserDB.findByCredentials(email, password);
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    }
    catch(error){
        //console.log(error);
        res.status(404).send({error});
    }
});

//get all users
router.get('/user/me', auth, async (req, res)=>{
    res.send({user: req.user});
});

router.post('/user/logout', auth, async(req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });

        await req.user.save();
        res.send({"result": "successful logout"});
    }
    catch(e){
        res.status(500).send();
    }
});

router.post('/user/logoutall', auth, async (req, res)=>{
    try{
        req.user.tokens = [];
        await req.user.save();
        res.send({"result": "Logged from all the devices"});
    }
    catch(e){
        res.status(501).send();
    }
});

//update a user
router.patch('/user/me', auth, async (req, res)=>{
    const _id = req.params.id;
    const updates = req.body;
    try{
        const updatedUser = await UserDB.findByIdAndUpdate(_id, updates);
        if(!updatedUser){
            return res.status(404).send({"result": "user not found"});
        }
        await updatedUser.save();
        res.status(201).send({updatedUser});
    }
    catch(e){
        //console.log(e);
        res.status(501).send({"error": "database error"});
    }
});

//delete a user
router.delete('/user/me', auth, async (req, res)=>{
    try{
        req.user.remove();
        res.status(201).send(req.user);
    }
    catch(e){
        res.status(501).send({"error": "database error"});
    }
});

module.exports = router;