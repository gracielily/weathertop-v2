"use strict";
const uuid = require("uuid");
const stationStore = require("../models/station-store.js");

const dashboard = {
  index(request, response) {
    const viewData = {
      pageTitle: "Dashboard",
      stations: stationStore.getAllStations(),
    };
    response.render("dashboard", viewData);
  },

};

module.exports = dashboard;
