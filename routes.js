"use strict";

const express = require("express");
const router = express.Router();

const dashboard = require("./controllers/dashboard.js");
const about = require("./controllers/about.js");
const home = require("./controllers/home.js");
const station = require("./controllers/station.js");
const account = require("./controllers/account.js");

router.get("/", home.index);
router.get("/dashboard", dashboard.index);
router.post("/dashboard/addstation", dashboard.addStation);
router.get("/about", about.index);
router.get("/stations/:id", station.index);
router.post("/stations/:id/addreading", station.addReading);
router.get("/login", account.login);
router.post("/authenticate", account.authenticate);
router.get("/signup", account.signup);
router.post("/register", account.register);
router.get("/logout", account.logout);

module.exports = router;
