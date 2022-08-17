"use strict";

const constants = require("./constants.js");

const isBetween = (val, min, max) => {
  return val >= min && val <= max;
};

const analytics = {
  calculateBeaufort: (windSpeed) => {
    if (windSpeed === 1) {
      return "0 bft";
    } else if (isBetween(windSpeed, 1, 5)) {
      return "1 bft";
    } else if (isBetween(windSpeed, 6, 11)) {
      return "2 bft";
    } else if (isBetween(windSpeed, 12, 19)) {
      return "3 bft";
    } else if (isBetween(windSpeed, 20, 28)) {
      return "4 bft";
    } else if (isBetween(windSpeed, 29, 38)) {
      return "5 bft";
    } else if (isBetween(windSpeed, 39, 49)) {
      return "6 bft";
    } else if (isBetween(windSpeed, 50, 61)) {
      return "7 bft";
    } else if (isBetween(windSpeed, 62, 74)) {
      return "8 bft";
    } else if (isBetween(windSpeed, 75, 88)) {
      return "9 bft";
    } else if (isBetween(windSpeed, 89, 102)) {
      return "10 bft";
    } else if (isBetween(windSpeed, 103, 117)) {
      return "11 bft";
    }
    return "Unknown";
  },

  getWindCompass: (windDirection) => {
    if (360 - windDirection <= 11.25) {
      return "N";
    } else if (isBetween(windDirection, 11.25, 33.75)) {
      return "NNE";
    } else if (isBetween(windDirection, 33.75, 56.25)) {
      return "NE";
    } else if (isBetween(windDirection, 56.25, 78.75)) {
      return "ENE";
    } else if (isBetween(windDirection, 78.75, 101.25)) {
      return "E";
    } else if (isBetween(windDirection, 101.25, 123.75)) {
      return "ESE";
    } else if (isBetween(windDirection, 123.75, 146.25)) {
      return "SE";
    } else if (isBetween(windDirection, 146.25, 168.75)) {
      return "SSE";
    } else if (isBetween(windDirection, 168.75, 191.25)) {
      return "S";
    } else if (isBetween(windDirection, 191.25, 213.75)) {
      return "SSW";
    } else if (isBetween(windDirection, 213.75, 236.25)) {
      return "SW";
    } else if (isBetween(windDirection, 236.25, 258.75)) {
      return "WSW";
    } else if (isBetween(windDirection, 258.75, 281.25)) {
      return "W";
    } else if (isBetween(windDirection, 281.25, 303.75)) {
      return "WNW";
    } else if (isBetween(windDirection, 303.75, 326.25)) {
      return "NW";
    } else if (isBetween(windDirection, 326.25, 348.75)) {
      return "NNW";
    }
    return "Unknown";
  },

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
        return constants.RISING;
      } else if (
        values[len - 2] < values[len - 3] &&
        values[len - 1] < values[len - 2]
      ) {
        return constants.FALLING;
      }
      return constants.STEADY;
    }

  }
};

module.exports = analytics;
