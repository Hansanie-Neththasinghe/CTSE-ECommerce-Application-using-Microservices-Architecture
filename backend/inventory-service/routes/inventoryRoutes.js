const express = require("express");
const router = express.Router();
const {
  getAllItems,
  createItem,
  getItemByPid,
  getItemByProductId,
  updateItemByPid,
  updateItemByProductId,
  deleteItemByPid,
  deleteItemByProductId,
} = require("../controllers/inventoryController");

router.route("/").get(getAllItems).post(createItem);
router
  .route("/pid/:pid")
  .get(getItemByPid)
  .put(updateItemByPid)
  .delete(deleteItemByPid);
router
  .route("/product/:productId")
  .get(getItemByProductId)
  .put(updateItemByProductId)
  .delete(deleteItemByProductId);

module.exports = router;
