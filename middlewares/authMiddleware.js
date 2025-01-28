// middlewares/authMiddleware.js

// Named export for `isAuthenticated` function
export function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

// Named export for `isNotAuthenticated` function
export function isNotAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    // If the user is logged in, redirect to the homepage (or wherever)
    return res.redirect('/');
  } else {
    // If not logged in, proceed to the next middleware/route handler
    return next();
  }
}
