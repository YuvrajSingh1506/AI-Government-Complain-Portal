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
const { connectRedisCache } = require("./Config/redisCache");
const http = require("http");
const { Server } = require("socket.io");
const initializeSocket = require("./Socket/socket");
const { setIO } = require("./Config/socketManager");
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
        origin:process.env.FRONTEND_URL,
    })
)

const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin : process.env.FRONTEND_URL,
    }
})
setIO(io);
initializeSocket(io);
server.listen(PORT,()=>{
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

connectRedisCache();

// Initialize BullMQ complaint worker
require("./Worker/compliantWorker");