const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  jwt.verify(authorization, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) res.status(400);
    req.user = decoded.user;
    if(!req.user){
      res.status(401).send("Forbbiden")
    }
    next();
  });
};

module.exports = auth

