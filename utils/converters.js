"use strict";

const constants = require("./constants.js");
const analytics = require("./analytics.js");

const converters = {
  toBeaufortDisplay: (windSpeed) => {
    const bft = analytics.calculateBeaufort(windSpeed);
    const labelMap = constants.WIND_MAP;
    return {
      bft: bft,
      label: labelMap[bft] ? labelMap[bft] : "Unknown"
    };
  },

  toFahrenheit: (temperature) => {
    return (temperature * 9) / 5 + 32;
  },

  toWindCompass: (windDirection) => {
    const compass = analytics.getWindCompass(windDirection);
    if (compass === "Unknown") {
      return "Unknown";
    }
    const windCompassLetters = compass.split("");
    let label = "";
    windCompassLetters.map((letter) => {
      label += constants.COMPASS_MAP[letter] + " ";
    });
    return label.trim();
  },

  toWeatherDisplay: (weatherCode) => {
    return constants.WEATHER_MAP[weatherCode]
      ? constants.WEATHER_MAP[weatherCode]
      : { label: "Unknown", icon: "question" };
  },

  toTempIcon: (temp) => {
    if (temp > 18) {
      return "temperature red high";
    } else if (temp < 8) {
      return "temperature teal low";
    } else {
      return "thermometer";
    }
  },
  toWindIcon: (windSpeed) => {
    if (windSpeed >= 50 && windSpeed <= 88) {
      return "yellow wind";
    } else if (windSpeed > 88) {
      return "red wind";
    } else {
      return "wind";
    }
  },
  toTrendIcon: (trend) => {
    switch (trend) {
      case constants.RISING:
        return "angle double up red";
      case constants.FALLING:
        return "angle double down teal";
      case constants.STEADY:
        return "arrows alternate horizontal green";
    }
  },

  toWeatherTopCode(openWeatherCode) {
    /*
    Attempt to map code to weathertop code to unify data
    some codes do not match weathertop codes so return the original
    if they do not match
    */
    const map = constants.OPEN_WEATHER_MAPPING;
    let code = openWeatherCode;
    for (const key in map) {
      if (map[key].includes(openWeatherCode)) {
        code = key;
      }
    }
    return code;
  },

  toReadingDisplayData(reading) {
    const date = new Date(reading.timestamp);
    const displayDate = date.toISOString().split("T")[0];
    const displayTime = date.toLocaleTimeString([], { hour12: false });
    reading.displayTimestamp = {
      dateTime: displayDate + " " + displayTime,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
    reading.weather = this.toWeatherDisplay(reading.code);
    reading.tempFahrenheit = this.toFahrenheit(reading.temperature);
    reading.tempIcon = this.toTempIcon(reading.temperature);
    reading.beaufort = this.toBeaufortDisplay(reading.windSpeed);
    reading.windChill = analytics.calculateWindChill(
      reading.temperature,
      reading.windSpeed
    );
    reading.windCompass = this.toWindCompass(reading.windDirection);
    reading.windIcon = this.toWindIcon(reading.windSpeed);
    return reading;
  },

  toStationDisplayData(station) {
    station.maxTemp = analytics.getMax(station.readings, "temperature");
    station.minTemp = analytics.getMin(station.readings, "temperature");
    station.trendTempIcon = this.toTrendIcon(
      analytics.getTrend(station.readings, "temperature")
    );
    station.maxWindSpeed = analytics.getMax(station.readings, "windSpeed");
    station.minWindSpeed = analytics.getMin(station.readings, "windSpeed");
    station.trendWindSpeedIcon = this.toTrendIcon(
      analytics.getTrend(station.readings, "windSpeed")
    );
    station.maxPressure = analytics.getMax(station.readings, "pressure");
    station.minPressure = analytics.getMin(station.readings, "pressure");
    station.trendPressureIcon = this.toTrendIcon(
      analytics.getTrend(station.readings, "pressure")
    );

    station.readings.map((reading) => this.toReadingDisplayData(reading));
    return station;
  }
};

module.exports = converters;
