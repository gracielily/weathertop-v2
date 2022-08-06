"use strict";

const analytics = {

  calculateWindChill: (temperature, windSpeed) => {
    return (
      Math.floor(
        (13.2 +
          0.6215 * temperature -
          11.37 * Math.pow(windSpeed, 0.16) +
          0.3965 * temperature * Math.pow(windSpeed, 0.16)) *
          10
      ) / 10
    );
  },

  getMax: (readings, key) => {
    const values = readings.map((reading) => reading[key]);
    return Math.max(...values);
  },
  getMin: (readings, key) => {
    const values = readings.map((reading) => reading[key]);
    return Math.min(...values);
  },
  getTrend: (readings, key) => {
    const values = readings.map((reading) => reading[key]);
    const len = values.length;

    if (len > 2) {
      if (
        values[len - 2] > values[len - 3] &&
        values[len - 1] > values[len - 2]
      ) {
        return "RISING";
      } else if (
        values[len - 2] < values[len - 3] &&
        values[len - 1] < values[len - 2]
      ) {
        return "FALLING";
      }
      return "STEADY";
    }
    return;
  },
};

module.exports = analytics;
