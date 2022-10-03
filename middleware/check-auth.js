const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const decodeToken = jwt.verify(req.query.token, "mernStack");
    req.userData = decodeToken;
  } catch (err) {
    return res.status(202).json({ message: "Token Missing or Expired" });
  }
  next();
};
