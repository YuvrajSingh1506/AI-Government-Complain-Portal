const express = require("express");
const routes = express.Router();
const{
    createDepartment,
    updateDepartment,
    deleteDepartment,
    getAllDepartment,
} = require("../Controller/Department");
const { auth ,isAdmin } = require("../Middleware/auth");

routes.post("/createDepartment", auth, isAdmin, createDepartment);
routes.put("/updateDepartment/:deptId", auth, isAdmin, updateDepartment);
routes.delete("/deleteDepartment/:deptId", auth, isAdmin, deleteDepartment);
routes.get("/getAllDepartment", getAllDepartment);

module.exports = routes;