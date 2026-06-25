const express = require("express"); //This imports the Express framework, which helps you build a web server in Node.js easily.
const bcrypt = require("bcryptjs"); //This imports bcryptjs, used to encrypt (hash) passwords so you don’t store plain text passwords.
const jwt = require("jsonwebtoken"); //This imports JWT (JSON Web Token) library, used to create and verify login tokens for authentication.

const app = express(); //This creates an Express application object.
app.use(express.json()); //Express.js application to enable JSON request body parsing.Without this line, req.body will be undefined for JSON requests

// LOCAL STORAGE (fake database)
const users = [];

const SECRET = "mathi@123";

//==========================SIGNUP API=======================

app.post("/signup", async (req, res) => {

  const { username, password } = req.body;

  // check if user exists
  const userExists = users.find(u => u.username === username);

  if (userExists) {
    return res.json({ message: "User already exists" });
  }

  // hash password (Take the password, convert it into a secure secret code, and store it in hashedPassword)


  //await means: “wait until hashing is finished” Because hashing takes time
  //10 This is “strength level” higher number = more secure but slower
  ////bcrypt.hash(...)converts password into a secret string...ex $2b$10$N9qo8uLOickgx2ZMRZo5i.e....
  
  const hashedPassword = await bcrypt.hash(password, 10); 

  // save user
  users.push({
    username,
    password: hashedPassword
  });

  res.json({
    message: "User created successfully"
  });
});


//=============================LOGIN API=============================

app.post("/login", async (req, res) => {

  const { username, password } = req.body;

  // find user
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.json({ message: "User not found" });
  }

  // check password
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.json({ message: "Wrong password" });
  }

  // create token
  const token = jwt.sign(
    { username: user.username },
    SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
});

//=========================PROTECTED ROUTE====================

app.get("/dashboard", (req, res) => {

  const token = req.headers.authorization;

  if (!token) {
    return res.json({ message: "No token" });
  }

  try {
    const data = jwt.verify(token, SECRET);

    res.json({
      message: "Welcome to dashboard",
      user: data
    });

  } catch (err) {
    res.json({ message: "Invalid token" });
  }
});


//=================START SERVER===============

app.listen(5000, () => {
  console.log("Server running on port 5000");
});