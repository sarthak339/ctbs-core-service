
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Your Google OAuth credentials
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Passport.js Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:8089/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
  // Handle user profile and authentication token
  return done(null, { profile, accessToken });
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Middleware to authenticate with Google
const googleAuthMiddleware = passport.authenticate('google', { scope: ['profile', 'email'] });

module.exports = googleAuthMiddleware;
