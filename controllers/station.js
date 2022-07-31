"use strict";
const uuid = require("uuid");
const stationStore = require("../models/station-store.js");
const contextData = {
      pageTitle: "Station Details",
      navBreadcrumbs: [
        { title: "Dashboard", link: "/dashboard" },
        { title: "Station Details" },
      ],
    };
const station = {
  index(request, response) {
    const stationId = request.params.id;
    contextData["station"] = stationStore.getStation(stationId);
    response.render("station", contextData);
  },
  addReading(request, response) {
    const stationId = request.params.id;
    const reading = {
      id: uuid.v4(),
      code: request.body.code,
      temperature: request.body.temperature,
      windSpeed: request.body.windSpeed,
      windDirection: request.body.windDirection,
      pressure: request.body.pressure,
    };
    try {
      stationStore.addReading(stationId, reading);
      response.redirect("/stations/" + stationId);
    } catch (e) {
      contextData["station"] = stationStore.getStation(stationId);
      contextData["error"] = e;
      response.render("station", contextData);
    }
  },
};

module.exports = station;
