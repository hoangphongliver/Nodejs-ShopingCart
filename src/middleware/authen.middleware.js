const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_KEY, (err, decodedToken) => {
      if (err) {
        res.status(403).json(err);
      } else {
        next();
      }
    });
  } catch {
    res.status(401).json({
      error: "You have not permisson to access !!",
    });
  }
};
