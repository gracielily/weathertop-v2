"use strict";
const uuid = require("uuid");
const stationStore = require("../models/station-store");
const account = require("./account.js");
const axios = require("axios");
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
    if (!contextData.station) {
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
      const errorContextData = { ...contextData };
      errorContextData.error = e;
      response.render("station", errorContextData);
    }
  },
  deleteReading(request, response) {
    account.getLoggedInUserOrRedirect(request, response);
    const stationId = request.params.id;
    const readingId = request.params.readingId;
    stationStore.deleteReading(stationId, readingId);
    response.redirect("/stations/" + stationId);
  },
  generateLatestWeather(request, response) {
    const stationId = request.params.id;
    const station = stationStore.getStation(stationId);
    axios
      .get("https://api.openweathermap.org/data/2.5/onecall", {
        params: {
          lat: station.latitude,
          lon: station.longitude,
          units: "metric",
          appid: process.env.OPEN_MAP_API_KEY
        },
      })
      .then((res) => {
        const currentWeather = res.data.current;
        const reading = {
          id: uuid.v4(),
          timestamp: new Date().toJSON(),
          code: currentWeather.weather[0].id,
          temperature: currentWeather.temp,
          windSpeed: currentWeather.wind_speed,
          windDirection: currentWeather.wind_deg,
          pressure: currentWeather.pressure,
        };
        try {
          stationStore.addReading(stationId, reading);
          response.redirect("/stations/" + stationId);
        } catch (e) {
          const errorContextData = { ...contextData };
          errorContextData.error = e;
          response.render("station", errorContextData);
        }
      })
      .catch((error) => {
        const errorContextData = { ...contextData };
          errorContextData.error = error;
          response.render("station", errorContextData);
      });
  },
};

module.exports = station;
