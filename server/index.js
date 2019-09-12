// invoke the config method from dotenv
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const massive = require("massive");
const authController = require("./controllers/authController");
const app = express();

// destructure server_port, session_secret, and connection_string from dotenv
const { SERVER_PORT, SESSION_SECRET, CONNECTION_STRING } = process.env;

// middleware
app.use(express.json());

// database connection
massive(CONNECTION_STRING).then(db => {
  app.set("db", db);
  console.log("db is connected!");
});

// middleware
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
  })
);

// endpoints
app.post("/auth/register", authController.register);
app.post("/auth/login", authController.login);

// server connection
app.listen(SERVER_PORT, () => {
  console.log(`Server listening on PORT: ${SERVER_PORT}`);
});
