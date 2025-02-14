import express from "express";
import bcrypt from "bcryptjs"; 
import passport from "passport";
import db from "../db/db.js";

const router = express.Router();


router.get("/register", (req, res) => {
  res.render("register");
});


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


router.get("/login", (req, res) => {
  res.render("login");
});


router.post("/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
  })
);

router.get("/home", (req, res) => {
  console.log("User:", req.user); 
  if (!req.isAuthenticated()) {
    return res.redirect("/auth/login"); 
  }
  res.render("home", { user: req.user }); 
});



export default router;
