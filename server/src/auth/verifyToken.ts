const jwt = require("jsonwebtoken");

const JWT_SECRET = "{asdfghjklpoiueo8-agd-agahaq4}";

export const verifyToken = (req, res, next) => {
  const token = req.cookies?.auth_token;
//   console.log(req.cookies);
  if (!token) {
    return res.send("Access Denied!");
  }
  try {
      const verifiedData = jwt.verify(token, JWT_SECRET);
      req.user_name = verifiedData['user_name'];
      req.admin = verifiedData['admin'];
      next();
  } catch (err) {}
};
