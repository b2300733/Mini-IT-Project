const passport = require("passport");
// const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user.model");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Configure Nodemailer SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // Use `true` for 465, `false` for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Function to send a welcome email
const sendWelcomeEmail = async (email, username) => {
  try {
    await transporter.sendMail({
      from: `"L&B Pet Service" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Welcome to L&B Pet Service!",
      html: `
        <p>Dear <strong>${username}</strong>,</p>
        <p>Welcome to L&B Pet Service! 🐾</p>
        <p>We are thrilled to have you onboard. Explore our platform for pet sitting services, pet accessories marketplace, and more.</p>
        <p>Have fun and enjoy your time with us! ❤️</p>
        <p>Best regards,</p>
        <p><strong>L&B Pet Service Team</strong></p>
      `,
    });
    console.log("✅ Welcome email sent successfully!");
  } catch (error) {
    console.error("❌ Error sending welcome email:", error);
  }
};

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: "843271631263870",
//       clientSecret: "{}",
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
//             avatar:
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
      clientID: process.env.ClinetID,
      clientSecret: process.env.GoogleSec,
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
                "This email is already registered using a different method. Please login with email and password."
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
            avatar: profile.photos[0].value || "/profilePics/default_user.png",
            oauthProvider: "Google",
            oauthId: profile.id,
          });
          await user.save();

          // Send Welcome Email to New User
          await sendWelcomeEmail(user.email, user.username);
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
