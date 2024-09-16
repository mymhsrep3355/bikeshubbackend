const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const isSeller = (req, res, next) => {
  if (req.user.userType !== 'seller') {
    return res.status(403).json({ message: 'Access denied, only sellers can perform this action' });
  }
  next();
};

const isBuyer = (req, res, next) => {
  if (req.user.userType !== 'buyer') {
    return res.status(403).json({ message: 'Access denied, only buyers can perform this action' });
  }
  next();
};

module.exports = { verifyToken, isSeller, isBuyer };
