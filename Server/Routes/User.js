const express = require("express");
const routes = express.Router();
const{ signUp, login} = require("../Controller/Auth");
routes.post("/signup",signUp);
routes.post("/login", login);
module.exports = routes;