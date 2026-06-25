import {Router} from "express";
//Open the backpack and give me the item specifically labeled Router.
//++++++++++++++++++import middleware==============
import {getUserIndexById} from "../utils/middlewares.mjs"


import {createUserValidationSchema} from '../utils/validationSchemas.mjs'
import { validationResult,matchedData,checkSchema } from 'express-validator';

import express from "express"; 
import session from "express-session";

const router=Router();
//+================import data===========

import {users} from "../utils/constants.mjs"
// const users=[
//     {id:1,username:"mathi"},
//     {id:2,username:"heyram"},
//     {id:3,username:"sanjay"},
//     {id:4,username:"gopi"},
//     {id:4,username:"logu"}
// ];

router.get("/",(req,res)=>{
    req.session.visited=true; //used to make not changeble session cookie
    res.cookie("user","admin",{maxAge:600000,signed:true}); //used to send cookie ...cookies are small data
    //console.log(req.session); //used to print session details
    //console.log(req.session.id);
    req.sessionStore.get(req.session.id,(err,sessionData)=>{
        if(err){
            console.log(err);
        }else{
            console.log(sessionData);
        }
    })
    res.send({msg:"Root"});
});

router.get("/api/users",(req,res)=>{
    //console.log(req.headers.cookie); //print default cookie format
    //console.log(req.cookies); //this print normal cookies
    console.log(req.signedCookies); //this is used to print a signed cookie
    if(req.signedCookies.user && req.signedCookies.user==="admin"){
        res.send({users});
    }else{
        return res.send({msg:"you are not an admin"});
    }
    
});


router.get("/api/users/:id",(req,res)=>{

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


router.use(express.json());

router.post("/api/users",
    checkSchema(createUserValidationSchema),
    (req,res)=>{
        const result=validationResult(req);

        if(!result.isEmpty()){
            return res.status(400).send({error:result.array()});
        }

    //console.log(req['express-validator#contexts']);
    
    const body=matchedData(req); //

    //new user in json format
    const newUser ={id:users[users.length-1].id+1,...body} //logic for entry new user
    // res.status(201).send(req.body);    //for Status code change
    users.push(newUser); //add new data to db or local dataset
    res.status(201).send(newUser); //response send 
    
    
});


router.put("/api/users/:id",(req,res)=>{
    const id=parseInt(req.params.id);

    const userIndex=users.findIndex((user)=>user.id === id);
    if(userIndex===-1){
        return res.send({msg:"user not found"});
    }
    const {body}=req;
    users[userIndex]={id:id, ...body};
    return res.status(200).send({msg:"user updated"});
});


router.patch("/api/users/:id",(req,res)=>{
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


router.delete("/api/users/:id",getUserIndexById,(req,res)=>{
    const userIndex=req.userIndex;
    users.splice(userIndex,1);
    res.sendStatus(200);
});



export default router; //used to use in other module to export this...use with import


