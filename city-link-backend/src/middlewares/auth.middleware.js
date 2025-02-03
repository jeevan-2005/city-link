export const isAuth = async (req, res, next) => {
  const access_token = req.cookies.access_token;

  if (!access_token) {
    return res.status(400).json({
      msg: "Please login to access this resource",
    });
  }

  const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET);

  if (!decoded) {
    return res.status(400).json({
      msg: "Invalid access token",
    });
  }

  req.user = decoded.user;
  next();
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user?.role) {
      return res.status(403).json({
        msg: `Role: ${req.user?.role} is not allowed to access this resource.`,
      });
    }
    next();
  };
};
