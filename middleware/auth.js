const jwt = require('jsonwebtoken');
const SECRET = 'myjwtsecret';

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'توکن وجود ندارد' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'توکن معتبر نیست' });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'توکن منقضی یا نامعتبر است' });
  }
};
