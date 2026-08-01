const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const dbConnect = require("./Config/database");
const {cloudinaryConnect} = require("./Config/cloudinary");
const PORT = process.env.PORT || 4000;
const userRoutes = require("./Routes/User");
const deptRoutes = require("./Routes/Department");
const complainRoutes = require("./Routes/Complain");
const cors = require("cors");
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "./tmp/",
    })
);
app.use(
    cors({
        origin:"http://localhost:3000",
        credentials : true,
    })
)
app.listen(PORT,()=>{
    console.log(`App is listen on ${PORT}`);
})
app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/dept",deptRoutes);
app.use("/api/v1/complain",complainRoutes);
dbConnect();

cloudinaryConnect();
