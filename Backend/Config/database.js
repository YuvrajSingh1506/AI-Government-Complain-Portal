const mongoose = require("mongoose");
require("dotenv").config();
const dbConnect = ()=>{
    // console.log(process.env.MONGO_DB_URL)
    mongoose.connect(process.env.MONGO_DB_URL)
    .then(()=>{
        console.log("Database connected Successfully");
    })
    .catch((error)=>{
        console.log(error);
        process.exit(1);
    }
    )
}
module.exports = dbConnect;