const mysql = require("mysql2/promise");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
});

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).render("index", {
        message: "Please provide an email and password",
      });
    }

    const [results] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (
      !results.length ||
      !(await bcrypt.compare(password, results[0].password))
    ) {
      return res.status(401).render("index", {
        message: "Email or Password is incorrect",
      });
    }

    const id = results[0].id;
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };

    res.cookie("jwt", token, cookieOptions);
    res.status(200).redirect("/login");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    const [results] = await db.execute(
      "SELECT email FROM users WHERE email = ?",
      [email]
    );

    if (results.length > 0) {
      return res.render("index", { message: "That email is already in use" });
    }

    if (password !== passwordConfirm) {
      return res.render("index", { message: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    await db.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.render("index", { message: "User registered" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

// Middleware: Check if Logged In
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);

      const [results] = await db.execute("SELECT * FROM users WHERE id = ?", [
        decoded.id,
      ]);

      if (!results.length) {
        return next();
      }

      req.user = results[0];
      return next();
    } catch (error) {
      console.error(error);
      return next();
    }
  } else {
    next();
  }
};

// Logout
exports.logout = (req, res) => {
  res.cookie("jwt", "logout", {
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true,
  });

  res.status(200).redirect("/");
};
