const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const session = require("express-session");

const app = express();
const db = new sqlite3.Database("./database.db");

app.use(express.json());
app.use(express.static("public"));

app.use(session({
  secret: "secret123",
  resave: false,
  saveUninitialized: true
}));

db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  email TEXT UNIQUE,
  password TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY,
  userId INTEGER,
  cart TEXT
)`);

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  db.run(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, hash],
    function(err) {
      if (err) return res.status(400).send("User exists");
      res.send("User created");
    }
  );
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (!user) return res.status(400).send("No user");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).send("Wrong password");

    req.session.userId = user.id;
    res.send("Logged in");
  });
});

app.post("/order", (req, res) => {
  if (!req.session.userId) return res.status(401).send("Login first");

  const cart = JSON.stringify(req.body.cart);

  db.run(
    "INSERT INTO orders (userId, cart) VALUES (?, ?)",
    [req.session.userId, cart],
    () => res.send("Order saved")
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
