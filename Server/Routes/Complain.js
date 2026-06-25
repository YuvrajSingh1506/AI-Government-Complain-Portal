const express = require("express");
const route = express.Router();
const {
    auth, isCitizen, isOfficial, isAdmin
} = require("../Middleware/auth");
const {
    createComplain,
    getComplainDetail,
    updateComplain,
    getMyComplains,
    deleteComplain
} = require("../Controller/Complain");
const {
    assignComplain,
    rejectComplain,
    getComplainData,
    getAllComplains
} = require("../Controller/ComplainAdmin");

const{
    getAssignedComplain,
    updateComplainStatus
}= require("../Controller/ComplainOfficial")
//Citizen routes
route.post("/createComplain",auth, isCitizen, createComplain);
route.get("/getComplainDetails/:complainId", auth, getComplainDetail);
route.put("/updateComplain/:complainId",auth, isCitizen, updateComplain);
route.get("/myComplains", auth, isCitizen, getMyComplains);
route.delete("/deleteMyComplains/:complainId", auth, isCitizen, deleteComplain);



//Admin routes
route.put("/assignComplain", auth, isAdmin, assignComplain);
route.put("/rejectComplain", auth, isAdmin, rejectComplain);
route.get("/getDashboardData", auth, isAdmin, getComplainData)
route.get("/getAllComplains", auth, isAdmin, getAllComplains);


//Official routes
route.put("/updateComplainStatus", auth, isOfficial, updateComplainStatus);
route.get("/getAssignedComplain", auth, isOfficial, getAssignedComplain);




module.exports = route;