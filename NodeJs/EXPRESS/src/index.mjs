//==============Import Express=================
import express from "express";  //express is a Node.js framework used to create web servers and APIs.

//============validation(adavanced)=================
import {createUserValidationSchema} from './utils/validationSchemas.mjs'
import { validationResult,matchedData,checkSchema } from 'express-validator';

import {getUserIndexById} from "./utils/middlewares.mjs"

//======================cookie==============it is used to convert default cookie format to json 

import cookieParser from "cookie-parser";

//================session================

import session from "express-session";

//==============import passport==============

import { Strategy as LocalStrategy } from "passport-local";
import passport from "passport";

//+================import data===========

import {users} from "./utils/constants.mjs"


//==================route impote(adavanced)===========

import userRouter from "./routes/users.mjs";
const app=express();  //middleWare
app.use(express.json());
//app.use(cookieParser());//this is noraml cookie
app.use(cookieParser('mathi')); //it is used make encryped cookie value
app.use(session(
    {
        secret:"rombo secret",
        saveUninitialized:false, //in session any changes there only save 
        resave:false, //new change only save
        cookie:{
            maxAge:600000
        }
    }
));

app.use(passport.initialize()); //password authentication middleware
app.use(passport.session()); //


passport.use(
    new LocalStrategy(
        {
            usernameField: "username",
            passwordField: "password",
        },
        (username, password, done) => {
            const user = users.find(u => u.username === username);

            if (!user) {
                return done(null, false, { message: "Invalid Username" });
            }

            if (user.password !== password) {
                return done(null, false, { message: "Incorrect Password" });
            }

            return done(null, user);
        }
    )
);

//================add a Serilization====================

passport.serializeUser((user,done)=>{
    done(null,user.id);
});

passport.deserializeUser((id,done)=>{
    const user=users.find((u)=>u.id===id);
    done(null,user || false);
})


app.use(userRouter);



//==============Create an Express Application=======

//express() creates an Express application.
//app is the main object that handles routes and requests. in simple app--- as your web server
// const app=express();


//===============Define the Port=================
//The server will run on port 3000.
const PORT=3000;

app.post("/login",(req,res,next)=>{
        passport.authenticate("local",(err,user,info)=>{
            if(err) return next(err);
            if(!user){
                return res.status(401).json({message:info?.message || "Login Failed"})
            }
        req.logIn(user,(err)=>{
            if(err) return next(err);
            return res.json({message:"Login SuccessFull",user})
        })
        })(req,res,next);
})

//=================Start the Server=================
//app.listen() starts the server.
//The callback function runs once the server starts successfully.
app.listen(PORT,()=>{
    console.log(`App is running on Port ${PORT}`);
});

//======================Create User Data================

//Array of JSON object

// const users=[
//     {id:1,username:"mathi"},
//     {id:2,username:"heyram"},
//     {id:3,username:"sanjay"},
//     {id:4,username:"gopi"},
//     {id:4,username:"logu"}
// ];

//==============Root Route=============



/*
app.get("/",(req,res)=>{
    res.send({msg:"Root"});
});
*/
/*When someone visits:
http://localhost:3000/
Express executes this route.
*/

/*
app.get("/api/users",(req,res)=>{
    res.send({users});
});
*/
//=============Dynamic Route Parameter==============
/*
app.get("/api/users/:id",(req,res)=>{

    //The :id is called a route parameter.
    //req.params.id is used to get the value 
    //console.log(req.params);
const id=parseInt(req.params.id);

if(isNaN(id)){
    return res.status(400).send({msg:"Bad Request,.....Invalid Id"});
}
    //find() is used to search an array and return the first item that matches a condition.
    //find() checks each element one by one
    const user=users.find((user)=>user.id === id);
    if(user){
        return res.send(user);
    }
    return res.send({msg:"user not found"});

});
*/

//localhost:3000/api/users?filter=user_name&value=ma

//req.params → values inside the path (/user/123)
//req.query → values after ? (/user?id=123)

/*app.get("/api/users",(req,res)=>{
    //const {query:{filter,value}}=req;
    const { name, city } = req.query;
    console.log(filter,value);
    res.send(users);
});
 */

//==================post==================

// app.use(express.json());  //it is used to convert json 
/*---------noraml like without validation-------
app.post("/api/users",(req,res)=>{
    console.log(req.body);
    
    const {body}=req;

    //new user in json format
    const newUser ={id:users[users.length-1].id+1,...body} //logic for entry new user
    // res.status(201).send(req.body);    //for Status code change
    users.push(newUser); //add new data to db or local dataset
    res.status(201).send(newUser); //response send 
    
    
});
*/
/*
app.post("/api/users",
    checkSchema(createUserValidationSchema),
    (req,res)=>{
        const result=validationResult(req);

        if(!result.isEmpty()){
            return res.status(400).send({error:result.array()});
        }

    //console.log(req['express-validator#contexts']);
    
    const body=matchedData(req);

    //new user in json format
    const newUser ={id:users[users.length-1].id+1,...body} //logic for entry new user
    // res.status(201).send(req.body);    //for Status code change
    users.push(newUser); //add new data to db or local dataset
    res.status(201).send(newUser); //response send 
    
    
});
*/
//=================put======================
//complete update

/*
app.put("/api/users/:id",(req,res)=>{
    const id=parseInt(req.params.id);

    const userIndex=users.findIndex((user)=>user.id === id);
    if(userIndex===-1){
        return res.send({msg:"user not found"});
    }
    const {body}=req;
    users[userIndex]={id:id, ...body};
    return res.status(200).send({msg:"user updated"});
});

//==================patch==============
//used to update part of the data

app.patch("/api/users/:id",(req,res)=>{
    const id=parseInt(req.params.id);

    const userIndex=users.findIndex((user)=>user.id === id);
    if(userIndex===-1){
        return res.send({msg:"user not found"});
    }
    const {body}=req;
    users[userIndex]={...users[userIndex],...body}; //add existing data and new data both data add in json (both data)
    //order is important ...first existing data,second new data
    res.sendStatus(200);
    
});
*/

//================delete========================
/*
app.delete("/api/users/:id",(req,res)=>{
    const id=parseInt(req.params.id);

    const userIndex=users.findIndex((user)=>user.id === id);
    if(userIndex===-1){
        return res.send({msg:"user not found"});
    }
    users.splice(userIndex,1);
    res.sendStatus(200);
});
*/

 //========getById(Middleware)====================
//In Express, next() is used to pass control from the current middleware function to the next middleware (or route handler) in the chain.
//used to remove multiple same set of code

/*
const getUserIndexById=(req,res,next)=>{
    const id=parseInt(req.params.id);

    const userIndex=users.findIndex((user)=>user.id === id);
    if(userIndex===-1){
        return res.send({msg:"user not found"});
    }
    req.userIndex=userIndex;
    next();
}
*/


/*
app.delete("/api/users/:id",getUserIndexById,(req,res)=>{
    const userIndex=req.userIndex;
    users.splice(userIndex,1);
    res.sendStatus(200);
});
*/


