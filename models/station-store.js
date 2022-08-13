"use strict";
const _ = require("lodash");
const JsonStore = require("./json-store");
const userStore = require("./user-store.js");

const stationStore = {
  store: new JsonStore("./models/station-store.json", { stations: [] }),
  collection: "stations",

  getStationForUser(stationId, userId) {
    return this.store.findOneBy(this.collection, {
      id: stationId,
      userId: userId,
    });
  },

  getStationsForUser(userId) {
    return this.store.findAllBy(this.collection, { userId: userId });
  },

  _getStationOrThrowError(stationId, userId) {
    // check if station exists and belongs to the user
    const station = this.getStationForUser(stationId, userId);
    if (!station) {
      throw "Station is not valid";
    }
    return station;
  },

  addStation(station) {
    // check if the user is valid
    const user = userStore.getById(station.userId);
    if (!user) {
      throw "Must be a valid user";
    }

    const userStations = this.getStationsForUser(user.id);
    const stationNames = userStations.map((userStation) =>
      userStation.name.toLowerCase()
    );
    if (stationNames.includes(station.name.toLowerCase())) {
      throw "Station already exists";
    }
    this.store.add(this.collection, station);
    this.store.save();
  },

  deleteStation(stationId, userId) {
    const station = this._getStationOrThrowError(stationId, userId);
    this.store.remove(this.collection, station);
    this.store.save();
  },

  deleteAllStations(userId) {
    const stations = this.getStationsForUser(userId);
    if (!stations.length) {
      throw "No Stations to delete";
    }
    this.store.remove(this.collection, {'userId': userId})
    this.store.save();
  },

  addReading(stationId, userId, reading) {
    const station = this._getStationOrThrowError(stationId, userId);
    if (reading.windDirection < 0 || reading.windDirection > 360) {
      throw "Wind Direction must be between 0 and 360";
    } else if (reading.windSpeed < 0) {
      throw "Wind Speed must be between 0 and 117";
    }
    station.readings.push(reading);
    this.store.save();
  },

  deleteReading(stationId, userId, readingId) {
    const station = this._getStationOrThrowError(stationId, userId);
    _.remove(station.readings, { id: readingId });
    this.store.save();
  },

  deleteAllReadings(stationId, userId) {
    const station = this._getStationOrThrowError(stationId, userId);
    _.remove(station.readings);
    this.store.save();
  },
};

module.exports = stationStore;
