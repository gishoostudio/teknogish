const products = require('../products'); // مسیر درست

// نمایش همه محصولات
exports.getAllProducts = (req, res) => {
  res.json(products);
};

// افزودن محصول جدید (برای سادگی به آرایه اضافه می‌کنیم)
exports.addProduct = (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: 'نام و قیمت الزامی هستند' });
  }

  const newProduct = {
    id: products.length + 1,
    name,
    price,
  };

  products.push(newProduct);
  res.status(201).json({ message: 'محصول اضافه شد', product: newProduct });
};

// حذف محصول
exports.deleteProduct = (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'محصول یافت نشد' });
  }

  const deleted = products.splice(index, 1);
  res.json({ message: 'محصول حذف شد', deleted });
};
