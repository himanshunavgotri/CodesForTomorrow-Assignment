import axios from "axios";

const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = process.env.WEATHER_BASE_URL;
const url = `https://api.openweathermap.org/data/2.5/weather`;

export const getCurrentWeather = async (city: string) => {

  const response = await axios.get(url, {
    params: {
      q: city,
      appid: 'cf20eeb94f4e2709b2e78e0a0ce90dba',
      units: "metric",
    },
  });

  return response.data;
};

export const getCityWeatherAnalytics = async (city: string) => {
  const [current, forecast] = await Promise.all([
    axios.get(url, {
      params: {
        q: city,
        appid: 'cf20eeb94f4e2709b2e78e0a0ce90dba',
        units: "metric",
      },
    }),
    axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
      params: {
        q: city,
        appid: 'cf20eeb94f4e2709b2e78e0a0ce90dba',
        units: "metric",
      },
    }),
  ]);

  return {
    current: current.data,
    forecast: forecast.data,
  };
};