const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
app.set("view engine","pug");
app.set("views","views");

const bcrypt = require("bcrypt");
const User = require('../schemas/UserSchema');
app.use(bodyParser.urlencoded({extended :false }));

router.get("/",(req,res,next)=>{

   res.status(200).render("login");
})

router.post("/",async (req,res,next)=>{
   var payload = req.body;   

      if(req.body.logUseName && req.body.logPassword){
         var user = await User.findOne({
            $or:[
               { username:req.body.logUseName},
               {email:req.body.logPassword},
               
            ]
         }).catch((error)=>{
               console.log(error);
               payload.errorMessage = "Something went wrong";
   
               res.status(200).render("login",payload);
         });

         if(user != null){
            var result = await bcrypt.compare(req.body.logPassword,user.Password);
            if(result===true){
               req.session.user=user
               return res.redirect('/');
            }
            
         }payload.errorMessage = "Something went wrong";
   
         res.status(200).render("login",payload);
         
            
      }
      payload.errorMessage = "Something went wrong";
   
               res.status(200).render("login",payload);
      


})

module.exports=router;