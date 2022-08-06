"use strict";

const analytics = require("./analytics.js");

const isBetween = (val, min, max) => {
  return val >= min && val <= max;
};

const converters = {

  toBeaufortDisplay: (windSpeed) => {
    let bft = "Unknown";
    if (windSpeed == 1) {
      bft = "0 bft";
    } else if (isBetween(windSpeed, 1, 5)) {
      bft = "1 bft";
    } else if (isBetween(windSpeed, 6, 11)) {
      bft = "2 bft";
    } else if (isBetween(windSpeed, 12, 19)) {
      bft = "3 bft";
    } else if (isBetween(windSpeed, 20, 28)) {
      bft = "4 bft";
    } else if (isBetween(windSpeed, 29, 38)) {
      bft = "5 bft";
    } else if (isBetween(windSpeed, 39, 49)) {
      bft = "6 bft";
    } else if (isBetween(windSpeed, 50, 61)) {
      bft = "7 bft";
    } else if (isBetween(windSpeed, 62, 74)) {
      bft = "8 bft";
    } else if (isBetween(windSpeed, 75, 88)) {
      bft = "9 bft";
    } else if (isBetween(windSpeed, 89, 102)) {
      bft = "10 bft";
    } else if (isBetween(windSpeed, 103, 117)) {
      bft = "11 bft";
    }

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
    let compass = "Unknown";
    let label = "Unknown";

    if (360 - windDirection <= 11.25) {
      compass = "N";
    } else if (isBetween(windDirection, 11.25, 33.75)) {
      compass = "NNE";
    } else if (isBetween(windDirection, 33.75, 56.25)) {
      compass = "NE";
    } else if (isBetween(windDirection, 56.25, 78.75)) {
      compass = "ENE";
    } else if (isBetween(windDirection, 78.75, 101.25)) {
      compass = "E";
    } else if (isBetween(windDirection, 101.25, 123.75)) {
      compass = "ESE";
    } else if (isBetween(windDirection, 123.75, 146.25)) {
      compass = "SE";
    } else if (isBetween(windDirection, 146.25, 168.75)) {
      compass = "SSE";
    } else if (isBetween(windDirection, 168.75, 191.25)) {
      compass = "S";
    } else if (isBetween(windDirection, 191.25, 213.75)) {
      compass = "SSW";
    } else if (isBetween(windDirection, 213.75, 236.25)) {
      compass = "SW";
    } else if (isBetween(windDirection, 236.25, 258.75)) {
      compass = "WSW";
    } else if (isBetween(windDirection, 258.75, 281.25)) {
      compass = "W";
    } else if (isBetween(windDirection, 281.25, 303.75)) {
      compass = "WNW";
    } else if (isBetween(windDirection, 303.75, 326.25)) {
      compass = "NW";
    } else if (isBetween(windDirection, 326.25, 348.75)) {
      compass = "NNW";
    }
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
    if (isBetween(windSpeed, 50, 88)) {
      return "yellow wind";
    } else if (windSpeed > 88) {
      return "red wind";
    } else {
      return "wind";
    }
  },
  toTrendIcon: (trend) => {
    switch (trend) {
      case "RISING":
        return "angle double up red";
      case "FALLING":
        return "angle double up red";
      case "STEADY":
        return "arrows alternate horizontal green";
    }
  },

  toReadingDisplayData(reading) {
    reading.timestamp = new Date(reading.timestamp);
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
