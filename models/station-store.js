'use strict';

const stationStore = {

  stationCollection: require('./station-store.json').stationCollection,

  getAllStations() {
    return this.stationCollection;
  },

};

module.exports = stationStore;