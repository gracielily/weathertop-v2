"use strict";

const express = require("express");
const router = express.Router();

const dashboard = require("./controllers/dashboard.js");
const about = require("./controllers/about.js");
const home = require("./controllers/home.js");

router.get("/", home.index);
router.get("/dashboard", dashboard.index);
router.get("/about", about.index);

module.exports = router;
