const mongoose = require('mongoose');


const Schema =mongoose.Schema;

const UserShcema = new Schema({

    firstName:{
        type:String,
        require:true,
        trim:true,
    },
    lastName:{
        type:String,
        require:true,
        trim:true,
        },
     username:{
        type:String,
        require:true,
        trim:true,
        unique:true,
        },
    email:{
        type:String,
        require:true,
        trim:true,
        unique:true,
        },
    Password:{
        type:String,
        require:true,
        },
    profilePic:{
        type:String,
        default:"/images/profilepic.png",
        }
}, {timestamps:true });

var User = mongoose.model('User',UserShcema);

module.exports  =User;