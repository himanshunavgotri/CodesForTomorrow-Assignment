import app from './app';
import initDatabase from './database/init';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
      await initDatabase();
  
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    } catch (error) {
      console.error(error);
    }
  };
  
  startServer();