const { User, Wallet, Transaction } = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail } = require("../services/emailService");
const otpGenerator = require("otp-generator");
const generateReferralCode = require("../services/generateReferral");

const authController = {
  async signup(req, res) {
    try {
      const { email, password, number, name, referedBy } = req.body;
      const existingUser = await User.findOne({ email });
      console.log(referedBy);
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
      if (referedBy) {
        referringUser = await User.findOne({ referralCode: referedBy });
      }
      const newUser = new User({
        email,
        name,
        number,
        password: hashedPassword,
        referredBy: referringUser ? referringUser.referralCode : null,
        referralCode: generateReferralCode(),
        verificationCode: otp,
        verificationCodeExpires: Date.now() + 600000,
        verified: false,
      });

      const newWallet = new Wallet();
      newUser.wallet = newWallet;
      //console.log(referringUser.email);
      await newUser.save();

      const emailResult = await sendVerificationEmail(email, otp);

      if (emailResult.success) {
        res.status(200).json({
          message: `User created. Verification email sent. User referral code is  ${newUser.referralCode}`,
        });
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
      const token = jwt.sign({ email: user.email }, "lottery-app");


      req.user = {
        email: user.email,
      };
      console.log(req.user);
      //res.status(200).send({ token });
      res.status(200).send({ token, ...user._doc  });
    } catch (error) {
      console.log(error);
    }
  },
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
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({ ...user._doc });
    } catch (error) {
      console.error("Error occurred:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  },
  async editUser(req, res) {
    try {
      const token = req.headers.authorization;
      const { name, image, number } = req.body;
      if (!token) {
        return res.status(401).json({ error: "Token not provided" });
      }
      const decoded = await jwt.verify(token, "lottery-app");
      const userEmail = decoded.email;
      const user = await User.findOne({ email: userEmail });
      if (!user) {
        res.status(404).json({ error: "user not found" });
      }
      if (name) {
        user.name = name;
      }
      if (image) {
        user.image = image;
      }
      if (number) {
        user.number = number;
      }
      await user.save();

      res.status(200).json({ message: "User Updated successfully", user });
    } catch (e) {
      res.status(500).json({ message: "internal server error" });
    }
  },
  async forgotPassword(req, res) {
    const otp = req.generatedOTP;
    console.log(req.email);
    const user = await User.findOne({ email: req.email });
    user.tempOTP = otp;
    user.save();
    res.send(user.tempOTP);
  },
  async changePasscode(req, res) {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({ message: "Please provide email, OTP, and new password" });
    }

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(404)
          .json({
            message: "User not found. Please enter a registered email.",
          });
      }

      if (user.tempOTP !== otp) {
        return res
          .status(400)
          .json({ message: "Invalid OTP. Password change failed." });
      }

      const newHashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = newHashedPassword;
      await user.save();

      return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Something went wrong. Password change failed." });
    }
  },
};

module.exports = authController;
