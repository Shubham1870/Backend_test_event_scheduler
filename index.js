const express=require("express")
const app=express()
const bodyParser = require("body-parser")
const mongoose=require("mongoose")
const port=3000

app.use(express.json())

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

mongoose.connect("mongodb://localhost/test").then(()=>console.log("connected"))
const Schema=mongoose.Schema

const Scheduleschema=mongoose.Schema({
    title:String,
    description:String,
    location:String,
    startTime:String,
    endTime:String
})
const mymodel=mongoose.model("test",Scheduleschema)

app.get("/v1/events",async(req,res)=>{
    try{
        const data=await mymodel.find({})
        res.status(200).json({
            status:"success",
            data:data
        })
    }
    catch(error){
        res.status(400).json({
            status:"failed",
            message:error.message
        })
    }
})
app.get("/v1/events/:id",async(req,res)=>{
    try{
        const data=await mymodel.findOne({_id:req.params.id})
        res.status(200).json({
            status:"success",
            data:data
        })
    }
    catch(error){
        res.status(400).json({
            status:"failed",
            message:"there is no event with that id"
        })
    }
})
app.post("/v1/events",async(req,res)=>{
    try{
        if((req.body.title=="")){
            res.status(400).json({
                status:"error",
                message:"VALIDATION ERROR:title is required"
            })
        }
        const data=await mymodel.create({
            title:req.body.title,
            description:req.body.description,
            location:req.body.location,
            startTime:req.body.startTime,
            endTime:req.body.endTime
        })
        res.status(201).json({
            status:"success",
            data:data
        })
    }
    catch(error){
        res.status(400).json({
            status:"failed",
            message:error.message
        })
    }
})
app.put("/v1/events/:id",async(req,res)=>{
    try{
        if((req.body.title=="")){
            res.status(400).json({
                status:"error",
                message:"VALIDATION ERROR:title is required"
            })
        }
        await mymodel.find({_id:req.params.id}).updateOne(req.body)
        const data=await mymodel.findOne({_id:req.params.id})
        res.status(200).json({
            status:"success",
            data:data
        })
    }
    catch(error){
        res.status(400).json({
            status:"failed",
            message:error.message
        })
    }
})
app.delete("/v1/events/:id",async(req,res)=>{
    try{
        const deletedata=await mymodel.deleteOne({_id:req.params.id})
        res.status(204).json({
            message:"selected data deleted"
           
        })
    }
    catch(error){
        res.status(400).json({
            status:"failed",
            message:error.message
        })
    }
})
app.listen(port,()=>console.log("app is running"))