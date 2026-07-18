import { Request, Response } from "express";
import db from "../config/db";

import {
  getCurrentWeather,
  getCityWeatherAnalytics,
} from "../service/weatherService";

export const getCitiesAnalytics = async (req: Request, res: Response) => {
  try {
    const { cities } = req.body;

    if (!cities || !Array.isArray(cities)) {
      return res.status(400).json({
        message: "Cities array is required",
      });
    }

    const weatherData = await Promise.all(
      cities.map(async (city: string) => {
        const data = await getCurrentWeather(city);
        await db.execute(
          `INSERT INTO weather_data
          (city_name, current_temperature, forecast)
          VALUES (?, ?, ?)`,
          [data.name, data.main.temp, JSON.stringify(data.weather)],
        );

        return {
          city: data.name,
          temp: data.main.temp,
          forecast: data.weather[0].main,
        };
      }),
    );

    const temperatures = weatherData.map((c) => c.temp);

    const averageTemperature =
      temperatures.reduce((a, b) => a + b, 0) / temperatures.length;

    const highestTemperature = weatherData.reduce((a, b) =>
      a.temp > b.temp ? a : b,
    );

    const lowestTemperature = weatherData.reduce((a, b) =>
      a.temp < b.temp ? a : b,
    );

    const hotCities = weatherData.filter((c) => c.temp > 25).map((c) => c.city);

    res.status(200).json({
      averageTemperature: Number(averageTemperature.toFixed(2)),
      highestTemperature: {
        city: highestTemperature.city,
        temp: highestTemperature.temp,
      },
      lowestTemperature: {
        city: lowestTemperature.city,
        temp: lowestTemperature.temp,
      },
      hotCities,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.response?.data?.message || error.message,
    });
  }
};

export const getCityAnalytics = async (req: Request, res: Response) => {
  try {
    const name = req.params.name as string;

    const { current, forecast } = await getCityWeatherAnalytics(name);

    const temperatures = forecast.list.map((item: any) => item.main.temp);

    const minTemperature = Math.min(...temperatures);
    const maxTemperature = Math.max(...temperatures);

    const forecastData = forecast.list.slice(0, 5).map((item: any) => ({
      date: item.dt_txt,
      temperature: item.main.temp,
      condition: item.weather[0].main,
    }));

    const warning =
      current.main.temp > 35 ? "Temperature exceeds 35°C" : "No warning";

    await db.execute(
      `INSERT INTO weather_data
      (city_name, current_temperature, min_temperature, max_temperature, forecast, warning)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        current.name,
        current.main.temp,
        minTemperature,
        maxTemperature,
        JSON.stringify(forecastData),
        warning,
      ],
    );

    res.status(200).json({
      city: current.name,
      currentTemperature: current.main.temp,
      minTemperature,
      maxTemperature,
      forecast: forecastData,
      warning: warning,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.response?.data?.message || error.message,
    });
  }
};
