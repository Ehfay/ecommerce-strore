import express from "express";
import pool from "../db/db.js";

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products"); 
    res.render("products", { products: result.rows }); 
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("Internal Server Error");
  }
});


router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]); 
    if (result.rows.length === 0) {
      return res.status(404).send('Product not found');
    }
    res.render('product-detail', { product: result.rows[0] });
  } catch (err) {
    console.error('Error fetching product details:', err);
    res.status(500).send('Error fetching product details');
  }
});

export default router;
