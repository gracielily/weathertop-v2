"use strict";
const _ = require("lodash");
const JsonStore = require("./json-store");
const userStore = require("./user-store.js");

const stationStore = {
  store: new JsonStore("./models/station-store.json", { stations: [] }),
  collection: "stations",

  getAllStations() {
    return this.store.findAll(this.collection);
  },

  getStation(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  getStationsForUser(userId) {
    return this.store.findAllBy(this.collection, { userId: userId });
  },

  addStation(station) {
    const usersIds = userStore.getAllUsers().values("id");
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
  
  deleteStation(id){
    const station = this.getStation(id);
    this.store.remove(this.collection, station);
    this.store.save()
  },

  addReading(id, reading) {
    const station = this.getStation(id);
    if (reading.code < 100 || reading.code > 805) {
      throw "Weather Code must be between 100 and 805";
    } else if (reading.windDirection < 0 || reading.windDirection > 360) {
      throw "Wind Direction must be between 0 and 360";
    } else if (reading.windSpeed < 0) {
      throw "Wind Speed must be between 0 and 117";
    }
    station.readings.push(reading);
    this.store.save();
  },

  deleteReading(stationId, readingId) {
    const station = this.getStation(stationId);
    _.remove(station.readings, { id: readingId });
    this.store.save();
  },
};

module.exports = stationStore;
