const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  // Get our JWT from the cookie
  const authToken = req.cookies.authToken;

  // No token = not logged in
  if (!authToken) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  try {
    // Verify that our backend created this JWT
    const decoded = jwt.verify(
      authToken,
      process.env.JWT_SECRET
    );

    // Get MongoDB user ID from JWT
    req.userId = decoded.userId;

    // Continue to the actual endpoint
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = requireAuth;