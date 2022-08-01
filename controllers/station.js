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
    if(!contextData.station){
      response.render("404");
    }
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
  deleteReading(request, response){
    account.getLoggedInUserOrRedirect(request, response);
    const stationId = request.params.id
    const readingId = request.params.readingId
    stationStore.deleteReading(stationId, readingId);
    response.redirect("/stations/" + stationId);
  }
};

module.exports = station;
