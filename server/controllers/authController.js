// Require bcrypt
const bcrypt = require("bcryptjs");

// use async keyword before function
async function register(req, res) {
  const { username, password, isAdmin } = req.body;
  const db = req.app.get('db');
  const result = await db.get_user([username]);
  const existingUser = result[0];
  if (existingUser) {
    return res.status(409).send('Username taken');
  }
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  const registeredUser = await db.register_user([isAdmin, username, hash]);
  const user = registeredUser[0];
  req.session.user = { isAdmin: user.is_admin, username: user.username, id: user.id };
  return res.status(201).send(req.session.user);
}

async function login(req, res) {
  const db = req.app.get("db");
  // destructure username and password from body
  const { username, password } = req.body;
  // create a foundUser variable and store the query of get_user matching the username from req.body
  const foundUser = await db.get_user([username]);
  // access the first element of the foundUser and store in user var
  const user = foundUser[0];
  // if there is no user found, send a res with status 401
  // with string containing msg stating so
  if (!user) {
    return res
      .status(401)
      .json("User not found. Please register as a new user before logging in.");
  } else {
    // This compares the password entered by the user at login to the hashed
    // and salted version stored in the db
    const isAuthenticated = await bcrypt.compareSync(password, user.hash);
    //  if the password does the match, send a response stating so
    if (!isAuthenticated) {
      return res.status(403).json("Incorrect password.");
    }
    // set req.session.user to be an obj with the same properties
    // as the user obj from the register endpoint
    // using the data retrieved from the get_user query
    req.session.user = {
      isAdmin: user.is_admin,
      id: user.id,
      username: user.username
    };
    // send req.session.user as a response with status code 200
    return res.status(200).json(req.session.user);
  }
}

async function logout(req, res) {
  req.session.destroy();
  return res.sendStatus(200);
}

module.exports = {
  register,
  login,
  logout
};
