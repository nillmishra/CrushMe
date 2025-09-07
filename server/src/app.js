const express = require('express');
const app = express();

// Home route
app.get("/", (req, res) => {
    res.send("Hello from Dashboard");
});

// Test route
app.get("/test", (req, res) => {
    res.send("Hello from test");
});

// Hello route
app.get("/hello", (req, res) => {
    res.send("Hello from hello");
});

// Start server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
