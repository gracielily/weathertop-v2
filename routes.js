"use strict";

const express = require("express");
const router = express.Router();

const dashboard = require("./controllers/dashboard.js");
const about = require("./controllers/about.js");
const home = require("./controllers/home.js");
const station = require("./controllers/station.js");

router.get("/", home.index);
router.get("/dashboard", dashboard.index);
router.post("/dashboard/addstation", dashboard.addStation);
router.get("/about", about.index);
router.get("/stations/:id", station.index);
router.post('/stations/:id/addreading', station.addReading);

module.exports = router;
