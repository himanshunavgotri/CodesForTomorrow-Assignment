import db from "../../config/db";

export const weatherTable = async () => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS weather_data (
      id INT AUTO_INCREMENT PRIMARY KEY,
      city_name VARCHAR(100) NOT NULL,
      current_temperature DECIMAL(5,2),
      min_temperature DECIMAL(5,2),
      max_temperature DECIMAL(5,2),
      forecast JSON,
      warning VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  `);
};