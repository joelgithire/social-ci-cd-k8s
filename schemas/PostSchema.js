const mongoose = require('mongoose');
const Schema =mongoose.Schema;

const PostShcema = new Schema({
    content:{type:String,trim:true,},
    postedBy:{type:Schema.Types.ObjectId,ref:"User"},
    likes:[{type:Schema.Types.ObjectId,ref:'User'}],
    shareUsers:[{type:Schema.Types.ObjectId,ref:'User'}],
    shareData:{type:Schema.Types.ObjectId,ref:'Post'},
    replyTo:{type:Schema.Types.ObjectId,ref:'Post'},
    pinned:Boolean,
}, {timestamps:true });

var Post = mongoose.model('Post',PostShcema);

module.exports  =Post;