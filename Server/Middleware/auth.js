const jwt  = require("jsonwebtoken");
require("dotenv").config();
const User = require('../Models/User');
exports.auth = async(req, res, next) =>{
    try{
        const token = req.cookies?.token
                         || req.body?.token
                         || req.header("Authorization")?.replace("Bearer ","");
        if(!token){
            return res.status(400).json({
                success : false,
                message : "token is missing ",
                error : token,
            })
        }
        // console.log("from auth toke");
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
        }catch(err){
            return res.status(401).json({
                    success: false,
                    message :"token is invalid",
                })
        }
        next();
    }catch(err){
        console.log(err);
            res.status(401).json({
                success : false,
                message : "Something went wrong while validating the token",
        })
    }
}
exports.isCitizen = async(req, res, next) =>{
    try{
        if(req.user.role !== "Citizen"){
            return res.status(401).json({
                    success:false,
                    message : "THis is protected routes for Citizen only"
            })
        } 
        next();
    }catch(err){
        return res.status(500).json({
            success : false,
            message : "User role connot be verified, please try again"
        })
    }
}
exports.isOfficial = async(req, res, next) =>{
     try{
        if(req.user.role !== "Official"){
            return res.status(401).json({
                    success:false,
                    message : "THis is protected routes for Official only"
            })
        } 
        next();
    }catch(err){
        return res.status(500).json({
            success : false,
            message : "User role connot be verified, please try again"
        })
    }
}
exports.isAdmin = async(req, res, next) =>{
     try{
        if(req.user.role !== "Admin"){
            return res.status(401).json({
                    success:false,
                    message : "THis is protected routes for Admin only"
            })
        } 
        next();
    }catch(err){
        return res.status(500).json({
            success : false,
            message : "User role connot be verified, please try again"
        })
    }
}