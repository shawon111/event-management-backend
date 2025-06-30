const app = require('./app');
const connectDB = require('./config/connectDB');
const dotenv = require('dotenv');
// Load environment variables
dotenv.config();

// Set the port
const port = process.env.PORT || 5000;

// Database connection
connectDB();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Visit http://localhost:${port} to access the server`);
})