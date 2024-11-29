const express = require("express");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");

dotenv.config({ path: "./.env" });

const app = express();

// Creazione di un pool di connessioni
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
});

app.locals.db = db; // Condivisione del pool di connessioni per l'intera app

// Configurazione delle directory e dei middleware
const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Imposta il motore di visualizzazione
app.set("view engine", "hbs");

// Test connessione al database
(async () => {
  try {
    await db.getConnection();
    console.log("Connessione al Database riuscita");
  } catch (error) {
    console.error("Errore durante la connessione al Database:", error);
  }
})();

// Rotte
app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));

// Avvio del server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
