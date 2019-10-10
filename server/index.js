// invoke the config method from dotenv
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const massive = require("massive");
const app = express();

// Controllers
const authController = require("./controllers/authController");
const treasureController = require("./controllers/treasureController");
const auth = require("./middleware/authMiddleware");

// destructure server_port, session_secret, and connection_string from dotenv
const { SERVER_PORT, SESSION_SECRET, CONNECTION_STRING } = process.env;

// database connection
massive(CONNECTION_STRING).then(db => {
  app.set("db", db);
  console.log("db is connected!");
});

// middleware
app.use(express.json());

app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET
  })
);

// endpoints
app.post("/auth/register", authController.register);
app.post("/auth/login", authController.login);
app.get("/auth/logout", authController.logout);

app.get("/api/treasure/dragon", treasureController.dragonTreasure);
app.get(
  "/api/treasure/user",
  auth.usersOnly,
  treasureController.getUserTreasure
);
app.post(
  "/api/treasure/user",
  auth.usersOnly,
  treasureController.addUserTreasure
);
app.get(
  "/api/treasure/all",
  auth.usersOnly,
  auth.adminsOnly,
  treasureController.getAllTreasure
);

// server connection
app.listen(SERVER_PORT, () => {
  console.log(`Server listening on PORT: ${SERVER_PORT}`);
});
