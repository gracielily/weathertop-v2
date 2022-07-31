"use strict";
const _ = require("lodash");
const JsonStore = require('./json-store');

const stationStore = {
  store: new JsonStore('./models/station-store.json', { stationCollection: [] }),
  collection: 'stationCollection',

  getAllStations() {
    return this.store.findAll(this.collection);
  },

  getStation(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },
  
  addStation(station){
    this.store.add(this.collection, station);
    this.store.save();
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
    this.store.save();
  },
  
};

module.exports = stationStore;
