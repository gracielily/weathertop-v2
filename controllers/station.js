"use strict";
const uuid = require("uuid");
const stationStore = require("../models/station-store.js");

const station = {
  index(request, response) {
    const stationId = request.params.id;
    const viewData = {
      pageTitle: "Station Details",
      station: stationStore.getStation(stationId),
    };
    response.render("station", viewData);
  },
  addReading(request, response) {
    const stationId = request.params.id;
    const reading = {
      code: request.body.code,
      temperature: request.body.temperature,
      windSpeed: request.body.windSpeed,
      windDirection: request.body.windDirection,
      pressure: request.body.pressure,
    };
    try {
    stationStore.addReading(stationId, reading);
    response.redirect("/stations/" + stationId);
    } catch(e){
      response.render("station", {pageTitle: "Station Details", station: stationStore.getStation(stationId), error: e})
    }
    
  },
};

module.exports = station;
