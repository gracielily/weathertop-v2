"use strict";

const constants = require("./constants.js");
const analytics = require("./analytics.js");

const converters = {
  toBeaufortDisplay: (windSpeed) => {
    const bft = analytics.calculateBeaufort(windSpeed);
    const labelMap = {
      "0 bft": "Calm",
      "1 bft": "Light Air",
      "2 bft": "Light Breeze",
      "3 bft": "Gentle Breeze",
      "4 bft": "Moderate Breeze",
      "5 bft": "Fresh Breeze",
      "6 bft": "Strong Breeze",
      "7 bft": "Near Gale",
      "8 bft": "Gale",
      "9 bft": "Severe Gale",
      "10 bft": "Strong Storm",
      "11 bft": "Violent Storm",
    };
    return {
      bft: bft,
      label: labelMap[bft] ? labelMap[bft] : "Unknown",
    };
  },

  toFahrenheit: (temperature) => {
    return (temperature * 9) / 5 + 32;
  },

  toWindCompass: (windDirection) => {
    const compass = analytics.getWindCompass(windDirection);
    let label = "Unknown";

    const compassMap = {
      N: "North",
      S: "South",
      E: "East",
      W: "West",
    };

    if (compass !== "Unknown") {
      const windCompassLetters = compass.split("");
      windCompassLetters.map((letter) => {
        label += compassMap[letter] + " ";
      });
    }
    return label.trim();
  },

  toWeatherDisplay: (weatherCode) => {
    const weatherMap = {
      100: {
        label: "Clear",
        icon: "sun",
      },
      200: {
        label: "Partial Clouds",
        icon: "cloud sun",
      },
      300: {
        label: "Cloudy",
        icon: "cloud",
      },
      400: {
        label: "Light Showers",
        icon: "cloud sun rain",
      },
      500: {
        label: "Heavy Showers",
        icon: "cloud showers heavy rain",
      },
      600: {
        label: "Rain",
        icon: "cloud rain",
      },
      700: {
        label: "Snow",
        icon: "snowflake",
      },
      800: {
        label: "Thunder",
        icon: "bolt",
      },
    };

    return weatherMap[weatherCode]
      ? weatherMap[weatherCode]
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
        return "angle double up red";
      case constants.STEADY:
        return "arrows alternate horizontal green";
    }
  },

  toReadingDisplayData(reading) {
    const date = new Date(reading.timestamp);
    const displayDate = date.toISOString().split("T")[0];
    const displayTime = date.toLocaleTimeString([], { hour12: false });
    reading.displayTimestamp = {
    dateTime: displayDate + " " + displayTime,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
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
  },
};

module.exports = converters;
