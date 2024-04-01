const jwt = require("jsonwebtoken");
const userSchema = require("../model/user");

const superadminAuthMiddleware = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Authorization token is missing." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userSchema.findById(decoded.user._id);

    if (!user || user.role !== "superadmin") {
      return res
        .status(403)
        .json({ message: "Access denied. Superadmin authorization required." });
    }

    req.user = user;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid authorization token." });
    } else if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Authorization token has expired." });
    } else {
      return res.status(500).json({ message: "Internal server error." });
    }
  }
};

module.exports = superadminAuthMiddleware;
