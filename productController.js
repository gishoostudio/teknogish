const Product = require('./products');

// افزودن محصول
exports.addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ message: 'محصول با موفقیت اضافه شد', product });
  } catch (error) {
    res.status(500).json({ error: 'خطا در افزودن محصول' });
  }
};

// دریافت همه محصولات
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'خطا در دریافت محصولات' });
  }
};

// حذف محصول با آیدی
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'محصول حذف شد' });
  } catch (error) {
    res.status(500).json({ error: 'خطا در حذف محصول' });
  }
};
