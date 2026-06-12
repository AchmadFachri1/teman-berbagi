require('dotenv').config();
const app = require('./app');
const connectDB = require('./config');

const port = process.env.PORT || 5000;

// Only connect to DB and start server if not in test
if (process.env.NODE_ENV !== 'test') {
  const startServer = async () => {
    try {
      await connectDB();
      app.listen(port, () => {
        console.log('\n=================================');
        console.log('🚀 SERVER BERHASIL DIJALANKAN');
        console.log('=================================');
        console.log(`📍 Localhost: http://localhost:${port}`);
        console.log(`🏥 Health check: http://localhost:${port}/api/health`);
        console.log('=================================\n');
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  };

  startServer();
}

module.exports = app;