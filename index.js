const express = require("express");
const app = express();

// Prototypes
// Logging
// Routes
// DB
// Config
// Validation

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
