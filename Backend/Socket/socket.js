const jwt = require("jsonwebtoken")

const initializeSocket = (io) =>{
    io.on("connection",(socket)=>{
        
          const token = socket.handshake.auth.token;

            if (!token) {
                console.log("No Token");

                socket.disconnect();

                return;
            }
            let payload;
            try {

               payload = jwt.verify(
                    token,
                    process.env.JWT_SECRET
                );

                console.log(payload);

            } catch (err) {

                console.log("Invalid Token");

                socket.disconnect();

                return;
            }
            socket.user = payload;
            // console.log(socket.user);
            socket.join(socket.user.id);
            if(socket.user.role === "Admin"){
                socket.join("admins");
            }
        console.log(`User Connected socket ID : ${socket.id}`);
        console.log("User Is : ",  socket.user.id);
        socket.on("disconnect",()=>{
            console.log(`User Disconnected : ${socket.id}`);
            // console.log("Reason",reason);
        });
    });
};
module.exports = initializeSocket