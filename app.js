const express = require('express');
const app = express();
const port = 3004;
const middleware = require('./middleware');
const server = app.listen(port,()=>console.log("running on port :" + 3004))
const path = require('path')
const bodyParser = require('body-parser');
const mongoose = require("./database");
const session = require("express-session");





app.set("view engine","pug");
app.set("views","views");

app.use(bodyParser.urlencoded({ extended : false }));
app.use(express.static(path.join(__dirname,"/public")));

app.use(session({
    secret:"My Session",
    resave:true,
    saveUninitialized:false
}))
//routes

const loginRoute = require('./routes/loginRoutes');
const registerRoute = require('./routes/registerRoutes');
const postRoute = require('./routes/postRoutes');

const profileRoute = require('./routes/profileRoute');
const logOutRoute = require('./routes/logOutRoute');

//api routes
const postApiRoute = require('./routes/api/post');
const usersApiRoute = require('./routes/api/users');

app.use("/login",loginRoute);
app.use("/register",registerRoute);
app.use("/logout",logOutRoute);
app.use("/posts",middleware.requireLogin,postRoute);
app.use("/profile",middleware.requireLogin,profileRoute);

app.use("/api/posts",postApiRoute);
app.use("/api/users",usersApiRoute);

app.get("/",middleware.requireLogin,(req,res,next)=>{

    var payload = {
        pageTitle:"ApprenticeOre",
        userLoggedIn:req.session.user,
        userLoggedInJS:JSON.stringify(req.session.user)
    }

    res.status(200).render("home",payload);
})