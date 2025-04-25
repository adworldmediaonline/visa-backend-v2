import mongoose from 'mongoose';

const dbConnect = async () => {
  try {
    mongoose.set('strictQuery', false);

    const connectOptions = {
      serverSelectionTimeoutMS: 30000, // Increased to 30 seconds
      socketTimeoutMS: 60000, // Increased to 60 seconds
      heartbeatFrequencyMS: 10000,
      retryWrites: true,
      maxPoolSize: 10,
      family: 4,
    };

    const connection = await mongoose.connect(
      process.env.MONGODB_CONNECTION_STRING,
      connectOptions
    );

    console.log(
      `MongoDB Connected: ${connection.connection.host.split('.')[0]}`
    );

    // Add global connection error handler to prevent app crashes
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
      // Don't throw the error - just log it to avoid crashing the application
    });

    // Handle disconnections and attempt to reconnect
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Attempting to reconnect...');
      // Reconnection will be handled automatically by mongoose
    });

    return connection;
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);

    // Log but don't throw errors - prevent server crash on DB connection issues
    // This allows the server to still handle API requests even if DB is down

    // Optional: Set a reconnection timer
    console.log('Will attempt to reconnect to MongoDB in 15 seconds');
    setTimeout(() => {
      console.log('Attempting MongoDB reconnection...');
      dbConnect().catch(err => {
        console.error('Reconnection attempt failed:', err.message);
      });
    }, 15000);
  }
};

// Process-wide unhandled rejection handler to prevent crashes
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // No need to exit process - let it continue running
});

// Process-wide uncaught exception handler to prevent crashes
process.on('uncaughtException', error => {
  console.error('Uncaught Exception:', error);
  // Only exit on truly fatal errors
  if (error.code === 'EADDRINUSE') {
    console.error('Port in use, exiting...');
    process.exit(1);
  }
  // For other errors, log but don't crash
});

export default dbConnect;
