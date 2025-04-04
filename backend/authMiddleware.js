// authMiddleware.js


//important for login
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to authenticate tokens
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: "Access denied, token missing" });

  const tokenWithoutBearer = token.split(" ")[1]; // Removing "Bearer " part

  jwt.verify(tokenWithoutBearer, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });

    req.user = decoded; // Attach the decoded payload to the request object
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = authenticateToken;
