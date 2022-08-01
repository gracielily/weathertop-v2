"use strict";
const uuid = require("uuid");
const stationStore = require("../models/station-store.js");
const account = require("./account.js");

const dashboard = {
  index(request, response) {
    const user = account.getLoggedInUserOrRedirect(request, response);
    const viewData = {
      pageTitle: "Dashboard",
      stations: stationStore.getStationsForUser(user.id),
    };
    response.render("dashboard", viewData);
  },

  addStation(request, response) {
    const station = {
      id: uuid.v4(),
      name: request.body.name,
      latitude: Number(request.body.latitude),
      longitude: Number(request.body.longitude),
      readings: [],
    };
    try {
      stationStore.addStation(station);
      response.redirect("/dashboard");
    } catch (e) {
      response.render("dashboard", {
        pageTitle: "Dashboard",
        stations: stationStore.getAllStations(),
        error: e,
      });
    }
  },
};

module.exports = dashboard;
