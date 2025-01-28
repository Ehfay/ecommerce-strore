import express from "express";
import pool from "../db/db.js";
import formatCurrency from "../routes/utils/formatCurrency.js" 

const router = express.Router();


router.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  next();
});

router.get("/", (req, res) => {
  const cartItems = req.session.cart.map((item) => ({
    ...item,
    price: formatCurrency(item.price), 
  }));


  const totalPrice = formatCurrency(
    req.session.cart.reduce((total, item) => total + item.price * item.quantity, 0)
  );

 
  res.render("cart", { cartItems, totalPrice });
});


router.post("/add", async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res.status(400).json({ error: "Product ID and quantity are required." });
  }

  try {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [productId]);
    if (result.rows.length === 0) {
      return res.status(404).send("Product not found");
    }

    const product = result.rows[0];
    const cartItem = {
      productId: product.id,
      name: product.name,
      price: product.price, 
      quantity: parseInt(quantity, 10),
      image: product.image,
      size: product.size,
    };

    const existingItemIndex = req.session.cart.findIndex((item) => item.productId === cartItem.productId);

    if (existingItemIndex !== -1) {
      req.session.cart[existingItemIndex].quantity += cartItem.quantity;
    } else {
      req.session.cart.push(cartItem);
    }

    res.redirect("/cart");
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).send("An error occurred");
  }
});


router.post("/clear", (req, res) => {
  req.session.cart = [];
  res.redirect("/cart");
});

export default router;
