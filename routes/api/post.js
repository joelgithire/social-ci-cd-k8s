const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');



const User = require('../../schemas/UserSchema');
const Post = require('../../schemas/PostSchema');
const { findByIdAndDelete } = require('../../schemas/UserSchema');
const { renderFile } = require('pug');
app.use(bodyParser.urlencoded({extended :false }));

router.get("/",async (req,res,next)=>{

   var searchObj = req.query;

   if(searchObj.isReply !== undefined){
      var isReply = searchObj.isReply == "true";
      searchObj.replyTo = { $exists: isReply };
      delete searchObj.isReply;



   }
   if(searchObj.search !== undefined){
      searchObj.content = { $regex: searchObj.search,$options:"i"};
      delete searchObj.search
   }

   if(searchObj.followingOnly !== undefined){
      var followingOnly = searchObj.followingOnly == "true";

      if(followingOnly){
         var objectsIds = [];

         if(!req.session.user.following){
            req.session.user.following=[];
         }

         req.session.user.following.forEach(user =>{
            objectsIds.push(user);
         })

         objectsIds.push(req.session.user._id)
         searchObj.postedBy = { $in: objectsIds };

      } 
      delete searchObj.followingOnly;
   }

   var results = await getPosts(searchObj);
   res.status(200).send(results)
   
})

router.get("/:id",async (req,res,next)=>{
   
   var postId = req.params.id;
   var ids = postId.trim()

   
   var postData = await getPosts({_id:ids});

   postData = postData[0];

   var results = {
      postData :postData
   }

   if(postData.replyTo !== undefined){
      results.replyTo = postData.replyTo; 
   }

   results.replies = await getPosts({ replyTo:postId })

   res.status(200).send(results)
   
})

router.post("/",async (req,res,next)=>{

   if(!req.body.content){
      console.log("param not sent in request");
      return res.sendStatus(400);
   }
   var postData={

      content:req.body.content,
      postedBy:req.session.user,
}

   if(req.body.replyTo){
      postData.replyTo = req.body.replyTo
   }

   Post.create(postData)
   .then(async newPost=>{
      newPost=await User.populate(newPost,{path:"postedBy"})
      res.status(201).send(newPost)
   })
   .catch((error)=>{
      console.log(error);
      res.sendStatus(400);
   })



})

router.put("/:id/like",async (req,res,next)=>{
   
   var postId = req.params.id;
   var userId = req.session.user._id;

   var isLiked = req.session.user.likes && req.session.user.likes.includes(postId);

   var option = isLiked ? "$pull":"$addToSet"

   
   
  req.session.user =  await User.findByIdAndUpdate(userId,{[option]:{likes:postId}},{new:true})
   .catch(error=>{
      console.log(error)
      res.sendStatus(400)
   })
   
   var post =  await Post.findByIdAndUpdate(postId ,{[option]:{likes:userId}},{new:true})
   .catch(error=>{
      console.log(error)
      res.sendStatus(400)
   })

   res.status(200).send(post)
})

router.post("/:id/share",async (req,res,next)=>{
   var postId = req.params.id;
   var userId = req.session.user._id;

   var deletedPost = await Post.findOneAndDelete({ postedBy:userId,shareData:postId})
   .catch(error=>{
      console.log(error)
      res.sendStatus(400)
   })

   var option = deletedPost != null ? "$pull":"$addToSet"
   
   var repost = deletedPost;

   if(repost == null){
      repost = await Post.create({postedBy:userId,shareData:postId})

      .catch(error=>{
         console.log(error)
         res.sendStatus(400)
      })
   }

   
   req.session.user =  await User.findByIdAndUpdate(userId,{[option]:{shares:repost._id}},{new:true})
   .catch(error=>{
      console.log(error)
      res.sendStatus(400)
   })
   
   var post =  await Post.findByIdAndUpdate(postId ,{[option]:{shareUsers:userId}},{new:true})
   .catch(error=>{
      console.log(error)
      res.sendStatus(400)
   })

   res.status(200).send(post)
})

router.delete("/:id", (req,res, next)=>{
   Post.findByIdAndDelete(req.params.id)
   .then(()=> res.sendStatus(202))
   .catch(error=>{
      console.log(error);
      res.sendStatus(400); 
   })
})

router.put("/:id", async (req,res, next)=>{
   if(req.body.pinned !== undefined){
      await Post.updateMany({postedBy:req.session.user }, {pinned: false})
      .catch(error=>{
         console.log(error);
         res.sendStatus(400); 
      })
   }

   Post.findByIdAndUpdate(req.params.id, req.body)
   .then(()=> res.sendStatus(204))
   .catch(error=>{
      console.log(error);
      res.sendStatus(400); 
   })
})

 async function getPosts(filer){
  var results  = await Post.find(filer)
   .populate("postedBy")
   .populate("shareData")
   .populate("replyTo")
   .sort({"createdAt":-1})
   .catch(error=>{
      console.log(error)
   })

   results = await User.populate(results,{path:"replyTo.postedBy"});  
   return await User.populate(results,{path:"shareData.postedBy"});
   
}





module.exports=router;