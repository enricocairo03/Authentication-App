const express = require("express");
const authController = require("../controllers/auth");

const router = express.Router();

router.get("/", authController.isLoggedIn, (req, res) => {
  res.render("index", {
    user: req.user,
  });
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/profile", authController.isLoggedIn, (req, res) => {
  if (req.user) {
    res.render("profile", {
      user: req.user,
    });
  } else {
    res.redirect("/login");
  }
});

// Aggiunta di una rotta per modificare il profilo
router.post("/profile/:id", authController.isLoggedIn, async (req, res) => {
  const { name, email } = req.body;

  if (req.user.id !== parseInt(req.params.id)) {
    return res.status(403).send("You are not allowed to edit this profile.");
  }

  try {
    await db.execute("UPDATE users SET name = ?, email = ? WHERE id = ?", [
      name,
      email,
      req.params.id,
    ]);
    res.redirect("/profile");
  } catch (error) {
    console.error(error);
    res.status(500).send("Errore nel server");
  }
});

module.exports = router;
