const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const TaskDB = require('./task');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }]
});

userSchema.virtual('tasks', {
    ref: "Task",
    localField: "_id",
    foreignField: "owner"
})

userSchema.methods.toJSON = function (){     //need to understand this.
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

userSchema.methods.generateAuthToken = async function(){
    const user = this;

    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET);

    user.tokens = user.tokens.concat({token});  
    await user.save();

    return token;

}

userSchema.statics.findByCredentials = async(email, password) => {
    const user = await UserDB.findOne({email});
    if(!user){
        throw new Error("unable to login");
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        throw new Error('Unable to login');
    }
    //console.log('running');
    return user;
}

userSchema.pre('save', async function(next){        //we have used function instead of 
    const user = this;                            //arrow function because arrow functions don't bind this keyword.
    
    console.log('saving user');

    if(user.isModified('password')){
        //console.log('running');
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

userSchema.pre('remove', async function(next){
    const user = this;

    await TaskDB.deleteMany({owner: user._id});
    next();

})

const UserDB = mongoose.model('User', userSchema);

module.exports = UserDB;