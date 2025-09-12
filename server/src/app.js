const express = require('express');
const connectDB = require('./config/database'); // Ensure database connection is established
const app = express();
const cookieParser = require('cookie-parser');

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies

// Import and use routes
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);




// Connect to MongoDB and start the server
connectDB().then(() => {
    console.log('Connected to MongoDB');
    // Start server
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});



