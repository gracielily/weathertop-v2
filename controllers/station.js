"use strict";
const uuid = require("uuid");
const stationStore = require("../models/station-store");
const account = require("./account.js");
const contextData = {
      pageTitle: "Station Details",
      navBreadcrumbs: [
        { title: "Dashboard", link: "/dashboard" },
        { title: "Station Details" },
      ],
    };
const station = {
  index(request, response) {
    account.getLoggedInUserOrRedirect(request, response);
    const stationId = request.params.id;
    contextData.station = stationStore.getStation(stationId);
    response.render("station", contextData);
  },
  addReading(request, response) {
    account.getLoggedInUserOrRedirect(request, response);
    const stationId = request.params.id;
    const reading = {
      id: uuid.v4(),
      timestamp: new Date().toJSON(),
      code: request.body.code,
      temperature: Number(request.body.temperature),
      windSpeed: Number(request.body.windSpeed),
      windDirection: Number(request.body.windDirection),
      pressure: Number(request.body.pressure),
    };
    try {
      stationStore.addReading(stationId, reading);
      response.redirect("/stations/" + stationId);
    } catch (e) {
      const errorContextData = {...contextData}
      errorContextData.error = e;
      response.render("station", errorContextData);
    }
  },
};

module.exports = station;
