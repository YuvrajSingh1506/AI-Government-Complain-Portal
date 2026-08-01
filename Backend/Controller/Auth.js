const User = require("../Models/User");
const bycrpt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.signUp = async(req, res) =>{
    try{
        const {name, email, password, confirmPassword, role, department} = req.body;
        if(!name || !email || !password || !confirmPassword || !role){
            return res.status(400).json({
                success : false,
                message :"All field are required",
            })
        }
        if(password !== confirmPassword){
            return res.status(400).json({
                success : false,
                message :"Password and confirm password are not same, please try again",
            })
        }
        const existingUser = await User.exists({email});
             if(existingUser){
                return res.status(400).json({
                    success:false,
                    message : "User already exists"
                })
        }
        const hashedPassword = await bycrpt.hash(password, 10);
        const user = await User.create({
            name : name,
            password : hashedPassword,
            email : email,
            department : department,
            role : role,
        })
        const userObj = user.toObject();
        delete userObj.password;
        res.status(201).json({
            success : true,
            user : userObj, 
            message : "User created Successfully",
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            success : false,
            message : "Internal Server Error",
            error : err.message,
        })
    }
}

exports.login = async(req, res) =>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message : "All fields are required, please try again",
            });
        }
        const user = await User.findOne({
            email : email,
        })
        if(!user){
            return res.status(400).json({
                success : false,
                message :"User doesn't exists",
            })
        }
        // console.log(user);
        if(!await bycrpt.compare(password, user.password)){
              return res.status(401).json({
                success : false,
                message : "Password doesn't match "
            })
        }
        const payload = {
            email : user.email,
            id : user._id,
            role : user.role,
        };
        const token = jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn: "24h",
        })
        const userObj = user.toObject();
        userObj.token = token;
        delete userObj.password;
        const options = {
            expires : new Date(Date.now() + (3 * 24 * 60 * 60 * 1000) ),
            httpOnly : true,
        }
        // console.log(userObj);
        res.cookie("token",token,options).status(200).json({
            success : true,
            token,
            userObj,
            message : "Logged in succcessfully"
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            success : false,
            message : "Login failure, please try again",
            error :err.message,
        })
    }
}