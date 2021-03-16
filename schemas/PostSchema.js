const mongoose = require('mongoose');


const Schema =mongoose.Schema;

const PostShcema = new Schema({
    content:{type:String,trim:true,},
    postedBy:{type:Schema.Types.ObjectId,ref:"User"},
    pinned:Boolean,
    
}, {timestamps:true });

var Post = mongoose.model('Post',PostShcema);

module.exports  =Post;