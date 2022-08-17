const weatherMap = {
  100: {
    label: "Clear",
    icon: "sun"
  },
  200: {
    label: "Partial Clouds",
    icon: "cloud sun"
  },
  300: {
    label: "Cloudy",
    icon: "cloud"
  },
  400: {
    label: "Light Showers",
    icon: "cloud sun rain"
  },
  500: {
    label: "Heavy Showers",
    icon: "cloud showers heavy rain"
  },
  600: {
    label: "Rain",
    icon: "cloud rain"
  },
  700: {
    label: "Snow",
    icon: "snowflake"
  },
  800: {
    label: "Thunder",
    icon: "bolt"
  }
};

const windMap = {
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
  "11 bft": "Violent Storm"
};

const compassMap = {
  N: "North",
  S: "South",
  E: "East",
  W: "West"
};

const openWeatherMapping = {
  // open weather codes taken from https://openweathermap.org/weather-conditions
  100: [800], // Clear
  200: [801, 802], // Partial Clouds
  300: [803, 804], // Cloud
  400: [520], // Light Showers
  500: [522], // Heavy Showers
  600: [
    300, 301, 302, 310, 311, 312, 313, 314, 321, 500, 501, 502, 503, 504, 511,
    520, 521, 522, 530
  ], // Rain
  700: [600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622], // Snow
  800: [200, 201, 202, 210, 211, 221, 230, 231, 232] // Thunder
};

module.exports = {
  RISING: "RISING",
  FALLING: "FALLING",
  STEADY: "STEADY",
  WEATHER_MAP: weatherMap,
  WIND_MAP: windMap,
  COMPASS_MAP: compassMap,
  OPEN_WEATHER_MAPPING: openWeatherMapping
};
