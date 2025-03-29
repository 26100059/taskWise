// authMiddleware.js

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // Replace with a strong secret key

// Middleware to authenticate tokens
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: "Access denied, token missing" });

  const tokenWithoutBearer = token.split(" ")[1]; // Removing "Bearer " part

  jwt.verify(tokenWithoutBearer, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });

    req.user = decoded; // Attach the decoded payload to the request object

    // Now you can access the decoded values (userId, name) from req.user
    // console.log("USER ID IN AUTH ", req.user.userId);    // User ID
    // console.log("USER NAME IN AUTH ", req.user.name);      // User Name

    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = authenticateToken;
