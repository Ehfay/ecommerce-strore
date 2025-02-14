import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from './config/passportconfig.js';
import pg from 'pg'; 
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import checkoutRouter from "./routes/checkout.js";

dotenv.config();

const app = express();
const port = 3000;

const { Pool } = pg; 
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get("/", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/auth/login"); 
  }
  res.render("home", { user: req.user }); 
});



app.use('/auth', authRoutes); 
app.use('/products', productRoutes); 
app.use('/cart', cartRoutes); 
app.use("/checkout", checkoutRouter);


app.use((req, res) => {
  res.status(404).send('Page not found');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else if (process.env.NODE_ENV !== 'production') {
    console.log('Database connected at:', res.rows[0].now);
  }
});


