 import express  from "express";
 import path from "path";
 import mongoose from "mongoose";
 import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
 import bcrypt from "bcrypt"
 mongoose.connect("mongodb://127.0.0.1:27017",{
   dbName:"backend"
 }).then(()=> console.log("Database is Connected"))
 .catch((e)=> console.log(e))

 const userSchema=new mongoose.Schema({
   name:String,
   email:String,
   password: String
 });
 const User=mongoose.model("User",userSchema)

 const app=express();
   app.use(express.static(path.join(path.resolve(),"public"))
   )
   const users=[];

 app.use(express.urlencoded({extended:true}))
 app.use(cookieParser())
 //setting up view engine
 app.set("view engine","ejs");

 const isAuthenticated=async(req,res,next)=>{
   const {token}=req.cookies;
   if(token)
   { const decode= jwt.verify(token,"sdassad")
      req.user= await User.findById(decode._id)
     next()
   }
   else {
      res.redirect("/login")
   }
 }
 app.post("/login",async(req,res)=>{
   const {email,password}=req.body;
   let user = await User.findOne({email})
   if(!user) return res.redirect("login")

      const isMatch= await bcrypt.compare(password,user.password)
      if(!isMatch)   
      return res.render("login", {message:"Password is Incorrect"})
      const token=jwt.sign({_id:user._id},"sdassad")
   

      res.cookie("token",token,{
         httpOnly:true,
         expires: new Date(Date.now()+60*1000)
      })
      res.redirect("/")

 })

app.get("/",isAuthenticated,(req,res)=>{
   // console.log(req.cookies);
   // res.render("login")
   console.log(req.user);
    res.render("logout",{name:req.user.name})
   // res.sendFile("./index.html")
})
   app.get("/add", async(req,res)=>{
    await  collection.create({name:"Dev Johri", email:"D.@j.com"}) 
         res.send("bade bhai done");
       
   })
   app.get("/login", (req,res)=>{
      res.render("login")
   })
   app.post("/register",async(req,res)=>{
      const {name,email,password}=req.body
      let user=await User.findOne({email});
      if(user)
      { 
         return  res.redirect("/login")
      }const hashedPassword=await bcrypt.hash(password,10)
      user=  await User.create({
         name, email,password:hashedPassword
      })
      
      const token=jwt.sign({_id:user._id},"sdassad")
   

      res.cookie("token",token,{
         httpOnly:true,
         expires: new Date(Date.now()+60*1000)
      })
      res.redirect("/")
   })
   app.get("/register",  (req,res)=>{
       
           res.render("register");
         
     })
   app.get("/logout",(req,res)=>{
      res.cookie("token",null,{
        expires: new Date(Date.now())
      })
      res.redirect("/")
   })
   

 
 
 app.listen(5000,()=>{
    console.log("server is running");
 }) 