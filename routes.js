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
router.get("/dashboard/dismiss-welcome", dashboard.dismissWelcomeMessage);
router.post("/dashboard/addstation", dashboard.addStation);
router.get("/dashboard/delete-station/:id", dashboard.deleteStation);
router.get("/dashboard/delete-all-stations", dashboard.deleteAllStations);
router.get("/about", about.index);
router.get("/stations/:id", station.index);
router.post("/stations/:id/addreading", station.addReading);
router.get("/stations/:id/generatelatestweather", station.generateLatestWeather);
router.get("/stations/:id/delete-reading/:readingId", station.deleteReading);
router.get("/stations/:id/delete-all-readings", station.deleteAllReadings);
router.get("/login", account.login);
router.post("/authenticate", account.authenticate);
router.get("/signup", account.signup);
router.post("/register", account.register);
router.get("/logout", account.logout);
router.get("/users/:id", account.edit);
router.post("/users/:id/save-details", account.saveDetails);

module.exports = router;
