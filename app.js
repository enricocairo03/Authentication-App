const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");

dotenv.config({ path: "./.env" });

const app = express();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
});

const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));
// Parse URL-encoded badies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));
// Parse JSON badies (as sent by API clients)
app.use(express.json());
app.use(cookieParser());

app.set("view engine", "hbs");

db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Connessione al Database riuscita");
  }
});

// Define Routes
app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));

app.listen(3000, () => {
  console.log("Server listen on port 3000");
});
