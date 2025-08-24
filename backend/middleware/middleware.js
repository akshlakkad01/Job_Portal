const jwt = require("jsonwebtoken");
const authKeys = require("../lib/authKeys");

module.exports = function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    console.log("Header:", header);
    console.log("Scheme:", scheme);
    console.log("Token:", token);

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Missing or invalid Authorization header" });
    }

    const secret = authKeys.jwtSecretKey;
    const payload = jwt.verify(token, secret);

    console.log("Payload:", payload);
    

    // attach minimal safe user info from token
    req.user = {
      _id: payload._id,
      email: payload.email,
      role: payload.role,
    };

    console.log("req.user:", req.user);

    return next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};
