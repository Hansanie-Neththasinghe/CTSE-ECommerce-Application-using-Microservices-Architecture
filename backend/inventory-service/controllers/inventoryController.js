const Inventory = require("../models/Inventory");
const axios = require("axios");

// GET all inventory items
exports.getAllItems = async (req, res) => {
  try {
    const items = await Inventory.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE only with pid
exports.createItem = async (req, res) => {
  try {
    const { pid, quantity, remainingQuantity, productId } = req.body;
    const newItem = new Inventory({
      pid,
      quantity,
      remainingQuantity,
      productId,
    });
    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET by pid
exports.getItemByPid = async (req, res) => {
  try {
    const item = await Inventory.findOne({ pid: req.params.pid });
    if (!item)
      return res.status(404).json({ message: "Item not found by pid" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET by productId
exports.getItemByProductId = async (req, res) => {
  try {
    const item = await Inventory.findOne({ productId: req.params.productId });
    if (!item)
      return res.status(404).json({ message: "Item not found by productId" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE by pid
exports.updateItemByPid = async (req, res) => {
  try {
    const item = await Inventory.findOneAndUpdate(
      { pid: req.params.pid },
      req.body,
      { new: true }
    );
    if (!item)
      return res
        .status(404)
        .json({ message: "Item not found to update (by pid)" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE by productId
exports.updateItemByProductId = async (req, res) => {
  try {
    const item = await Inventory.findOneAndUpdate(
      { productId: req.params.productId },
      req.body,
      { new: true }
    );
    if (!item)
      return res
        .status(404)
        .json({ message: "Item not found to update (by productId)" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE by pid
exports.deleteItemByPid = async (req, res) => {
  try {
    const item = await Inventory.findOneAndDelete({ pid: req.params.pid });
    if (!item)
      return res
        .status(404)
        .json({ message: "Item not found to delete (by pid)" });
    res.json({ message: "Deleted successfully by pid" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE by productId
exports.deleteItemByProductId = async (req, res) => {
  try {
    const item = await Inventory.findOneAndDelete({
      productId: req.params.productId,
    });
    if (!item)
      return res
        .status(404)
        .json({ message: "Item not found to delete (by productId)" });
    res.json({ message: "Deleted successfully by productId" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
