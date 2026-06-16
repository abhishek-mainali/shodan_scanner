const jwt = require('jsonwebtoken');

const requireAuth = (allowedRoles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      
      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ error: "Insufficient privileges for this action" });
      }

      req.user = decoded;
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: "Access token expired", code: "TOKEN_EXPIRED" });
      }
      return res.status(401).json({ error: "Invalid authentication token" });
    }
  };
};

module.exports = requireAuth;
