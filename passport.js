const GoogleStrategy = require('passport-google-oauth2').Strategy;
const passport = require('passport');
const { User } = require('./models/User');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const generateReferralCode = require("./services/generateReferral");
const otpGenerator = require("otp-generator");

passport.serializeUser((user, done) => {
    console.log(user.user.email);
    done(null, user.user.email);  
});

passport.deserializeUser(async (email, done) => {
  try {
      const user = await User.findOne({ email });
      if (!user) return done(null, false);
      done(null, user); 
  } catch (err) {
      done(err, null); 
  }
});


passport.use(new GoogleStrategy({
  clientID: '305383757758-0b5g5e3g2tu6fi1veqdmaa0jac14rm40.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'https://encouraging-lime-tick.cyclic.app/auth/google/callback',
  passReqToCallback: true
},
async function(request, accessToken, refreshToken, profile, done) {
  try {
    let user = await User.findOne({ email: profile.email });
    const hashedPassword = await bcrypt.hash("google",10);
    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    
    const token = jwt.sign({ email: profile.email }, 'lottery-app');
    if (!user) {
      user = new User({
        name: profile.displayName,
        email: profile.email,
        googleId: profile.id,
        number: 123456789,
        password:hashedPassword,
        referralCode: generateReferralCode(),
        verificationCode: otp,
        verificationCodeExpires: Date.now() + 600000,
        verified: false,
      });
      user.token = token; 
      await user.save();
    } else {
      user.token = token; 
      await user.save();
    }

    console.log(user, "2");
    console.log(`this is the user token ${user.token}`);
    
    done(null, { user, token });
  } catch (err) {
    done(err, null);
  }
}));


module.exports = passport;
