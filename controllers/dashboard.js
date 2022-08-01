"use strict";
const uuid = require("uuid");
const stationStore = require("../models/station-store.js");
const account = require("./account.js");

const dashboard = {
  index(request, response) {
    const user = account.getLoggedInUserOrRedirect(request, response);
    const stations = stationStore.getStationsForUser(user.id);
    stations.sort((x, y) => x.name.toLowerCase().localeCompare(y.name.toLowerCase()))
    const contextData = {
      pageTitle: "Dashboard",
      stations: stations,
      user: user,
    };
    const displayWelcomeMsg = request.cookies["display_welcome_message"];
    if(displayWelcomeMsg) {
      contextData.displayWelcomeMsg = displayWelcomeMsg;
    }
    response.render("dashboard", contextData);
  },

  addStation(request, response) {
    const user = account.getLoggedInUserOrRedirect(request, response);
    const station = {
      id: uuid.v4(),
      userId: user.id,
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
  dismissWelcomeMessage(request, response) {
    response.clearCookie("display_welcome_message");
    response.redirect("/dashboard");
  },
};

module.exports = dashboard;
