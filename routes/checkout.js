import express from "express";
import pool from "../db/db.js"; 
import formatCurrency from "../routes/utils/formatCurrency.js";


const router = express.Router();


router.get("/", (req, res) => {
  const cartItems = req.session.cart.map((item) => ({
    ...item,
    price: formatCurrency(item.price),
  }));

  const totalPrice = formatCurrency(
    req.session.cart.reduce((total, item) => total + item.price * item.quantity, 0)
  );

  res.render("checkout", { cartItems, totalPrice });
});


router.post("/confirm", async (req, res) => {
  const { customer_name, email, address, payment_method } = req.body;

  if (!customer_name || !email || !address || !payment_method) {
    return res.status(400).send("All fields are required!");
  }

  try {
    const result = await pool.query(
      `INSERT INTO orders (customer_name, email, address, total_price, created_at, status) VALUES ($1, $2, $3, $4, NOW(), $5) RETURNING id`,
      [
        customer_name,
        email,
        address,
        req.session.cart.reduce((total, item) => total + item.price * item.quantity, 0),
        "Pending",
      ]
    );

    const orderId = result.rows[0].id;

    for (const item of req.session.cart) {
      await pool.query(
        `INSERT INTO order_items (order_id, product_name, price, quantity) VALUES ($1, $2, $3, $4)`,
        [orderId, item.productName, item.price, item.quantity]
      );
    }

    
    req.session.cart = [];

    if (payment_method === "bank_transfer") {
      res.send(`
        <h3>Bank Transfer</h3>
        <p>Please transfer the total amount to:</p>
        <p><strong>Account Name:</strong> Ehfay Skincare Bliss</p>
        <p><strong>Account Number:</strong> 1234567890</p>
        <p><strong>Bank Name:</strong> XYZ Bank</p>
        <p>Once the payment is confirmed, your order will be processed.</p>
        <a href="/checkout/thank-you">Return to Thank You Page</a>
      `);
    } else if (payment_method === "card") {
      res.send(`
        <h3>Card Payment</h3>
        <p>This is a sample implementation. Imagine your card payment was successful!</p>
        <a href="/checkout/thank-you">Return to Thank You Page</a>
      `);
    }
  } catch (error) {
    console.error("Error confirming payment:", error);
    res.status(500).send("An error occurred while confirming your payment.");
  }
});


router.get("/thank-you", (req, res) => {
  res.render("thank-you");
});

export default router;
