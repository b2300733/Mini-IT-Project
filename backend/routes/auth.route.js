const express = require("express");
const router = express.Router();
const passport = require("../controllers/auth.controller");

// router.get(
//   "/auth/facebook",
//   passport.authenticate("facebook", { scope: ["email"] })
// );

// router.get(
//   "/auth/facebook/callback",
//   passport.authenticate("facebook", { failureRedirect: "/" }),
//   (req, res) => {
//     const user = req.user;
//     const frontendUrl = `http://localhost:4200/auth/callback?token=${user._id}&username=${user.username}&avatar=${user.avatar}`;
//     res.redirect(frontendUrl);
//   }
// );

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const user = req.user;
    const frontendUrl = `http://localhost:4200/auth/callback?token=${
      user._id
    }&username=${user.username}&email=${user.email}&avatar=${
      user.avatar
    }&contactNo=${user.contactNo || ""}&gender=${user.gender || ""}&address1=${
      user.address1 || ""
    }&address2=${user.address2 || ""}&city=${user.city || ""}&state=${
      user.state || ""
    }&country=${user.country || ""}&zip=${user.zip || ""}&authToken=${
      user.authToken || ""
    }`;
    res.redirect(frontendUrl);
  }
);

module.exports = router;
