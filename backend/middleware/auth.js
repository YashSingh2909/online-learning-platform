import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_for_edusphere';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (!decoded?.id) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
      }

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer') ? header.split(' ')[1] : null;

    if (!token) return next();

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded?.id) {
      req.user = await User.findById(decoded.id);
    }

    return next();
  } catch (error) {
    req.user = null;
    return next();
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ success: false, message: `User role '${req.user.role}' is not authorized to access this route` });
    }
    next();
  };
};
