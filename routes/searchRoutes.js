const express = require('express');
const app = express();
const router = express.Router(); 
const bodyParser = require('body-parser');
const bcrypt = require("bcrypt");
const User = require('../schemas/UserSchema');



router.get("/", (req,res,next) => {

    var payload = createPayload(req.session.user)

   res.status(200).render("searchPage", payload);
})


router.get("/profile/:username", async (req,res,next) => {

    var payload = await getPayload(req.params.username,req.session.user); 

   res.status(200).render("profilePage", payload);
})


router.get("/:selectedTab", (req,res,next) => {

    var payload = createPayload(req.session.user)
    payload.selectedTab = req.params.selectedTab;

   res.status(200).render("searchPage", payload);
})

function createPayload(userLoggedIn){
    return {
        pageTitle:"Search",
        userLoggedIn:userLoggedIn,
        userLoggedInJS:JSON.stringify(userLoggedIn),
        
    }
}


async function getPayload(username,userLoggedIn){
    var user = await User.findOne({username:username})

    if(user == null){

        user = await User.findById(username)

        if(user==null){
            return {
                pageTitle:"User not found",
                userLoggedIn:userLoggedIn,
                userLoggedInJS:JSON.stringify(userLoggedIn),
                
            }
        }
        
    }

    return {
        pageTitle:user.username,
        userLoggedIn:userLoggedIn,
        userLoggedInJS:JSON.stringify(userLoggedIn),
        profileUser:user
        }
}

module.exports=router;