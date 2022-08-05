"use strict";

const express = require("express");
const logger = require("./utils/logger");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const app = express();
app.use(cookieParser());
const exphbs = require("express-handlebars");

const isBetween = (val, min, max) => {
  return val >= min && val <= max;
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(fileUpload());
app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: {
      section: function(name, options){ 
                if(!this._sections) this._sections = {};
                this._sections[name] = options.fn(this); 
                return null;
      },
      last: (arr) => {
        return arr[arr.length - 1];
      },
      capitilize: (val) => {
        if(val){
        return val.charAt(0).toUpperCase() + val.slice(1);
        }
      },
      weatherCodeDisplay: (weatherCode) => {
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
      tempIcon: (temp) => {
        if (temp > 18) {
          return "temperature red high";
        } else if (temp < 8) {
          return "temperature teal low";
        } else {
          return "thermometer";
        }
      },
      asFahrenheit: (temperature) => {
        return (temperature * 9) / 5 + 32;
      },
      toBeaufort: (windSpeed) => {
        if (windSpeed == 1) {
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
      beaufortLabel: (beaufort) => {
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
        return labelMap[beaufort] ? labelMap[beaufort] : "Unknown";
      },
      windIcon: (windSpeed) => {
        if (isBetween(windSpeed, 50, 88)) {
          return "yellow wind";
        } else if (windSpeed > 88) {
          return "red wind";
        } else {
          return "wind";
        }
      },
      windCompass: (windDirection) => {
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
      windCompassLabel: (windCompass) => {
        let label = "";
        const compassMap = {
          N: "North",
          S: "South",
          E: "East",
          W: "West",
        };
        if (windCompass === "Unknown") {
          return "Unknown";
        }
        const windCompassLetters = windCompass.split("");
        windCompassLetters.map((letter) => {
          label += compassMap[letter] + " ";
        });
        return label.trim();
      },
      windChill: (temperature, windSpeed) => {
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
      trendIcon: (trend) => {
        switch(trend){
          case "RISING":
            return "angle double up red";
          case "FALLING":
            return "angle double up red"
          case "STEADY":
            return "arrows alternate horizontal green"
        }
      },
      toFixed: (value) => {
        return value.toFixed(3);
      },
      formatTimestamp: (timestampString) => {
        const date = new Date(timestampString);
        const displayDate = date.toISOString().split("T")[0];
        const displayTime = date.toLocaleTimeString([], { hour12: false });
        return displayDate + " " + displayTime;
      },
      toJson: (obj) => {
        return JSON.stringify(obj);
      }
    },
  })
);
app.set("view engine", ".hbs");

const routes = require("./routes");
app.use("/", routes);

const listener = app.listen(process.env.PORT || 4000, function () {
  logger.info(`weathertop-v2 started on port ${listener.address().port}`);
});
