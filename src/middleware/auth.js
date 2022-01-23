const jwt = require('jsonwebtoken');
const UserDB = require('../models/user');

const auth = async(req, res, next) => {
    try{
        //console.log(JSON.stringify(req.headers));
        //console.log(req.header('Authorization'));
        const token = req.header('Authorization').replace('Bearer ', '');
        //console.log(token);
        const data = jwt.verify(token, process.env.JWT_SECRET);
        //console.log(data);
        const user = await UserDB.findOne({_id: data._id, 'tokens.token': token});

        if(!user){
            throw new Error();
        }
        req.token = token;
        req.user = user;
        next();
    }
    catch(e){
        res.status(404).send({error: "please authenticate"})
    }
}

module.exports = auth;