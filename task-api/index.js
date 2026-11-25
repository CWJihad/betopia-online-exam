require('dotenv/config');
const app = require('./app')
const connectDB = require('./src/config/db');
const PORT = process.env.PORT
const BACKEND_IP = process.env.BACKEND_IP

connectDB().then(() => {
  app.listen(PORT, () => {
  console.log(`Server is running on: http://${BACKEND_IP}:${PORT}`)
  })
}).catch((error) => {
  console.error('Database connection error:', error);
  process.exit(1); // Exit the process with an error code
})

