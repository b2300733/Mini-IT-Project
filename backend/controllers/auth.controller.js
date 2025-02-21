const passport = require("passport");
// const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user.model");

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: "843271631263870",
//       clientSecret: "ef0e201e2e6aa15b3c9d8258f703f75a",
//       callbackURL: "http://localhost:3000/auth/facebook/callback",
//       profileFields: ["id", "displayName", "photos", "email"],
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         // Find or create the user in the database
//         let user = await User.findOne({ oauthId: profile.id });
//         if (!user) {
//           user = new User({
//             username: profile.displayName,
//             email: profile.emails[0].value,
//             profilePicture:
//               profile.photos[0].value || "/profilePics/default_user.png",
//             oauthProvider: "Facebook",
//             oauthId: profile.id,
//           });
//           await user.save();
//         }
//         return done(null, user);
//       } catch (error) {
//         return done(error, null);
//       }
//     }
//   )
// );

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "814700521844-rf1kg5pq92r9t303u4vmr63qnsvqv0r4.apps.googleusercontent.com",
      // clientSecret: "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",
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (token, tokenSecret, profile, done) => {
      try {
        // Check if the email already exists in the database
        let existingUser = await User.findOne({
          email: profile.emails[0].value,
        });
        if (existingUser) {
          if (existingUser.oauthProvider !== "Google") {
            return done(
              new Error(
                "This email is already registered using a different method."
              ),
              null
            );
          }
          return done(null, existingUser);
        }

        // Find or create the user in the database
        let user = await User.findOne({ oauthId: profile.id });
        if (!user) {
          user = new User({
            username: profile.displayName,
            email: profile.emails[0].value,
            profilePicture:
              profile.photos[0].value || "/profilePics/default_user.png",
            oauthProvider: "Google",
            oauthId: profile.id,
          });
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
