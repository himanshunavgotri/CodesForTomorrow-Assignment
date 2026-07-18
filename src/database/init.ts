import { weatherTable } from "./tables/weathertable";

const initDatabase = async () => {
  try {
    await weatherTable();

    console.log("All tables are ready.");
  } catch (error) {
    console.error(error);
  }
};

export default initDatabase;