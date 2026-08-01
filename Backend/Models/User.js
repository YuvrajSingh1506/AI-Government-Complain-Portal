const mongoose = require("mongoose");

const userSchema = new  mongoose.Schema({
    name:{
        type : String, 
        required : true,
    },
    email : {
        type : String,
        required : true,
    },
    password : {
        type:String,
        required : true,
    },
    role : {
        type : String,
        enum : ["Admin","Citizen","Official"]
    },
    assignComplainCount:{
            type : Number,
            default : 0,
    },
    department:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Department",
        default : null,
    },
},
{timestamps : true}
);
module.exports = mongoose.model("User" , userSchema);