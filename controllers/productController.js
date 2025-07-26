import products from '../products.js'; // فرض بر اینه که `products.js` وجود داره و default export داره

export const getAllProducts = (req, res) => {
  res.json(products);
};

export const addProduct = (req, res) => {
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

export const deleteProduct = (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'محصول یافت نشد' });
  }

  const deleted = products.splice(index, 1);
  res.json({ message: 'محصول حذف شد', deleted });
};
