"use strict";
const _ = require("lodash");

const stationStore = {
  stationCollection: require("./station-store.json").stationCollection,

  getAllStations() {
    return this.stationCollection;
  },

  getStation(id) {
    return _.find(this.stationCollection, { id: id });
  },

  addReading(id, reading) {
    const station = this.getStation(id);
    if (reading.code < 100 || reading.code > 800) {
      throw "Weather Code must be between 100 and 800";
    } else if (reading.windDirection < 0 || reading.windDirection > 360) {
      throw "Wind Direction must be between 0 and 360";
    } else if (reading.windSpeed < 0) {
      throw "Wind Speed must be between 0 and 117";
    }
    station.readings.push(reading);
  },
};

module.exports = stationStore;
