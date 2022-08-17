"use strict";
const uuid = require("uuid");
const stationStore = require("../models/station-store");
const account = require("./account.js");
const axios = require("axios");
const converters = require("../utils/converters.js");

let contextData = {
  pageTitle: "Station Overview",
  navBreadcrumbs: [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Station Details" }
  ]
};

const station = {
  index(request, response) {
    const user = account.getLoggedInUserOrRedirect(request, response);
    const stationId = request.params.id;
    const station = stationStore.getStationForUser(stationId, user.id);
    if (!station) {
      return response.render("404");
    }
    contextData.station = converters.toStationDisplayData(station);
    response.render("station", contextData);
  },

  addReading(request, response) {
    const user = account.getLoggedInUserOrRedirect(request, response);
    const stationId = request.params.id;
    const reading = {
      id: uuid.v4(),
      timestamp: new Date().toJSON(),
      code: Number(request.body.code),
      temperature: Number(request.body.temperature),
      windSpeed: Number(request.body.windSpeed),
      windDirection: Number(request.body.windDirection),
      pressure: Number(request.body.pressure)
    };
    try {
      stationStore.addReading(stationId, user.id, reading);
      response.redirect("/stations/" + stationId);
    } catch (e) {
      const errorContextData = { ...contextData };
      errorContextData.error = e;
      response.render("station", errorContextData);
    }
  },

  deleteReading(request, response) {
    const user = account.getLoggedInUserOrRedirect(request, response);
    const stationId = request.params.id;
    const readingId = request.params.readingId;
    try {
      stationStore.deleteReading(stationId, user.id, readingId);
      response.redirect("/stations/" + stationId);
    } catch (e) {
      const errorContextData = { ...contextData };
      errorContextData.error = e;
      response.render("station", errorContextData);
    }
  },

  deleteAllReadings(request, response) {
    const user = account.getLoggedInUserOrRedirect(request, response);
    const stationId = request.params.id;
    try {
      stationStore.deleteAllReadings(stationId, user.id);
      response.redirect("/stations/" + stationId);
    } catch (e) {
      const errorContextData = { ...contextData };
      errorContextData.error = e;
      response.render("station", errorContextData);
    }
  },

  generateLatestWeather(request, response) {
    const user = account.getLoggedInUserOrRedirect(request, response);
    const stationId = request.params.id;
    const station = stationStore.getStationForUser(stationId, user.id);
    // make call to open weather api to retrieve weaher details
    axios
      .get("https://api.openweathermap.org/data/2.5/onecall", {
        params: {
          lat: station.latitude,
          lon: station.longitude,
          units: "metric",
          appid: process.env.OPEN_MAP_API_KEY
        }
      })
      .then((res) => {
        const currentWeather = res.data.current;
        // map the open weather code to a weathertop code
        const code = converters.toWeatherTopCode(currentWeather.weather[0].id);
        const reading = {
          id: uuid.v4(),
          timestamp: new Date().toJSON(),
          code: code,
          temperature: currentWeather.temp,
          windSpeed: currentWeather.wind_speed,
          windDirection: currentWeather.wind_deg,
          pressure: currentWeather.pressure
        };
        try {
          stationStore.addReading(stationId, user.id, reading);
          response.redirect("/stations/" + stationId);
        } catch (e) {
          const errorContextData = { ...contextData };
          errorContextData.error = e;
          response.render("station", errorContextData);
        }
      })
      .catch((error) => {
        const errorContextData = { ...contextData };
        errorContextData.error =
          "The Reading could not be generated: " + error.response.data.message;
        response.render("station", errorContextData);
      });
  }
};

module.exports = station;
