import express from "express";
import bcrypt from "bcryptjs"; 
import passport from "passport";
import db from "../db/db.js";

const router = express.Router();

// ✅ Render the register page
router.get("/register", (req, res) => {
  res.render("register");
});

// ✅ Handle user registration
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (checkResult.rows.length > 0) {
      return res.redirect("/auth/login");  // Fixed redirect
    }

    const hash = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO users (email, password) VALUES ($1, $2)", [email, hash]);
    res.redirect("/auth/login");
  } catch (err) {
    console.error(err);
    res.redirect("/auth/register");
  }
});

// ✅ Render the login page
router.get("/login", (req, res) => {
  res.render("login");
});

// ✅ Handle login
router.post("/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
  })
);

export default router;
