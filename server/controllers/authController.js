// Require bcrypt
const bcrypt = require("bcryptjs");

// use async keyword before function
async function register(req, res) {
  // Destructure username, password and isAdmin from req.body.
  const { username, password, isAdmin } = req.body;
  const db = db.app.get("db");

  // add await keyword to ensure that the promise resolves before the rest of the code executes
  // SQL queries come back in array, so take the first item of the array and set it to another const variable called existingUser
  const result = await db.get_user(username);
}

module.exports = {
  register
};
