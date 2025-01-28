
import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import passport from "passport";
import path from "path";
import env from "dotenv";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/product.js";

const app = express();
const port = process.env.PORT || 3000;
env.config();


app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(authRoutes); 
app.use("/products", productRoutes); 

app.get("/", (req, res) => {
  res.render("home");
});

app.use((req, res) => {
  res.status(404).send("Page not found");
});

const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) {
  console.log(`Server running on port ${port}`);
}



export default router;