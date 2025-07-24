const Product = require("../models/Product");

const getProducts = async (req, res) => {
    const products = await Product.find();
    res.json(products);
};

const addProduct = async (req, res) => {
    const { name, price, image } = req.body;
    const product = new Product({ name, price, image });
    await product.save();
    res.json(product);
};

module.exports = { getProducts, addProduct };