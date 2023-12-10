const { User, Wallet, Transaction } = require('../models/User'); 
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail } = require("../services/emailService");
const otpGenerator = require("otp-generator");
const generateReferralCode = require('../services/generateReferral');

const authController = {
  async signup(req, res) {
    try {
      const { email, password, number, name ,referralCode} = req.body;
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.json("Already exists");
      }

      const otp = otpGenerator.generate(4, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });

      const hashedPassword = await bcrypt.hash(password, 10);
      let referringUser = null;
      if(referralCode){
        referringUser = await User.findOne({referralCode});
      }
      const newUser = new User({
        email,
        name,
        number,
        password: hashedPassword,
        referredBy: referringUser ? referringUser.referralCode:null,
        referralCode: generateReferralCode(),
        verificationCode: otp,
        verificationCodeExpires: Date.now() + 600000,
        verified: false,
      });

      const newWallet = new Wallet();
      newUser.wallet = newWallet;

      await newUser.save();

      const emailResult = await sendVerificationEmail(email, otp);

      if (emailResult.success) {
        res
          .status(200)
          .json({ message: "User created. Verification email sent." });
      } else {
        res.status(500).json({
          message: "Error creating user or sending verification email",
        });
      }
    } catch (e) {
      console.log(e);
      res
        .status(500)
        .json({ message: "Error creating user or sending verification email" });
    }
  },
  async verify(req, res) {
    const { email, verificationCode } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const storedOTP = user.verificationCode;
    const codeExpiration = new Date(user.verificationCodeExpires).getTime();

    if (verificationCode === storedOTP && codeExpiration > Date.now()) {
      user.verified = true;
      await user.save();

      return res.status(200).json({ message: "Email verified successfully" });
    } else {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification code" });
    }
  },
  async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).send("User not found");
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).send("Invalid credentials");
      }
      //id set sign shayad ho 
      const token = jwt.sign({ email: user.email }, "lottery-app",);

      // Store user information in req.user
      req.user = {
        id: user._id,
        email: user.email,
        // Add any other necessary user details
      };
      console.log(req.user);
      //res.status(200).send({ token });
      res.status(200).send({ token, ...user._doc });
    } catch (error) {
      res.status(500).send("Login failed");
    }
  },
  //forgot password login not required rn
  // async forgotPassword(req, res, next) {
  //   const user = await User.findOne({ email: req.body.email });
  //   if (!user) {
  //     res.send("no user found with specified email");
  //   }
  //   const resetToken = user.createResetPasswordToken();
  //   await user.save({ validateBeforeSave: false });

  //   const resetURL = `${req.protocol}://${req.get(
  //     "host"
  //   )}/auth/forgotpassword/${resetToken}`;

  //   const message = `Request to reset password has been recieved. Please use the link below\n\n${resetURL}\n\n.This link is valid for 10 minutes`;
  //   try {
  //     await sendEmail({
  //       email: user.email,
  //       subject: "Password Change request",
  //       message: message,
  //     });
  //     res.status(200).json("Password reset link successfully sent to customer");
  //   } catch (e) {
  //     user.passwordResetToken = undefined;
  //     user.passwordResetTokenExpire = undefined;
  //     user.save({ validateBeforeSave: false });
  //     return next(e);
  //   }
  // },
  async getUser(req, res) {
    try {
      console.log("Getting user from JWT token");
      const token = req.headers.authorization;

      if (!token) {
        return res.status(401).json({ error: "Token not provided" });
      }

      const decoded = await jwt.verify(token, "lottery-app");
      const userEmail = decoded.email;
      const user = await User.findOne({ email: userEmail }); 
      if (!user) {
        res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({ ...user._doc });
    } catch (error) {
      console.error("Error occurred:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  },
};

module.exports = authController;
