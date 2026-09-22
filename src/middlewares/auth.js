const adminAuth = (req, res, next) => {
  const header = "xyz";
  const isAuthenticated = header === "xyz";
  if (!isAuthenticated) {
    return res.status(401).json({ message: "Unauthorized" });
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  const header = "xyzz";
  const isAuthenticated = header === "xyzz";
  if (!isAuthenticated) {
    return res.status(401).json({ message: "Unauthorized" });
  } else {
    next();
  }
};

module.exports = { adminAuth, userAuth };
