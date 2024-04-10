const jwt = require("jsonwebtoken");
const userSchema = require("../model/user");

exports.userAuthMiddleware = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Authorization token is missing." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = await userSchema.findById(decoded.user._id);

    if (!req.user) {
      return res.status(403).json({ message: "Invalid authorization token." });
    }
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
