const jwt = require("jsonwebtoken");
const config = require("../config");

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  try {
    const token = authHeader.split(" ")[1];
    req.user = jwt.verify(token, config.jwt.secret);
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Token tidak valid" });
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    return next();
  };
}

module.exports = {
  authenticate,
  authorize
};
