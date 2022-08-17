"use strict";
const uuid = require("uuid");
const stationStore = require("../models/station-store.js");
const account = require("./account.js");
const converters = require("../utils/converters.js");

let contextData = {
  pageTitle: "Dashboard"
};

const dashboard = {
  index(request, response) {
    const user = account.getLoggedInUserOrRedirect(request, response);
    const stations = stationStore.getStationsForUser(user.id);
    stations.sort((x, y) =>
      x.name.toLowerCase().localeCompare(y.name.toLowerCase())
    );
    stations.map((station) => converters.toStationDisplayData(station));
    contextData.stations = stations;
    contextData.user = user;
    contextData.displayWelcomeMsg = request.cookies["display_welcome_message"];
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
      readings: []
    };
    try {
      stationStore.addStation(station);
      response.redirect("/dashboard");
    } catch (e) {
      const errorContextData = { ...contextData };
      errorContextData.error = e;
      response.render("dashboard", errorContextData);
    }
  },

  deleteStation(request, response) {
    const user = account.getLoggedInUserOrRedirect(request, response);
    try {
      stationStore.deleteStation(request.params.id, user.id);
      response.redirect("/dashboard");
    } catch (e) {
      const errorContextData = { ...contextData };
      errorContextData.error = e;
      response.render("dashboard", errorContextData);
    }
  },

  deleteAllStations(request, response) {
    const user = account.getLoggedInUserOrRedirect(request, response);
    try {
      stationStore.deleteAllStations(user.id);
      response.redirect("/dashboard");
    } catch (e) {
      const errorContextData = { ...contextData };
      errorContextData.error = e;
      response.render("dashboard", errorContextData);
    }
  },

  dismissWelcomeMessage(request, response) {
    response.clearCookie("display_welcome_message");
    response.redirect("/dashboard");
  }
};

module.exports = dashboard;
