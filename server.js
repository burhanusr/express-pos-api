const app = require('./src/app');
const connectDB = require('./config/database');

/**
 * Establish database connection.
 */

connectDB();

/**
 * Get port from environment and store in Express.
 */

const port = process.env.PORT || 3000;

/**
 * Create a server and listen on provided port, on all network interfaces.
 */

app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});
