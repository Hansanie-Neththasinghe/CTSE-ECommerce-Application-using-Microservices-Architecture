const express = require("express");
const router = express.Router();
const {
  getAllCarts,
  getCartByUserId,
  addToCart,
  deleteCartByUserId,
  updateCart
} = require("../controllers/cartController");

router.get("/", getAllCarts);
router.get("/:userid", getCartByUserId);
router.post("/", addToCart);
router.put("/:userid", updateCart);
router.delete("/:userid", deleteCartByUserId);

module.exports = router;
