const nodemailer = require("nodemailer");
const crypto = require("crypto");
const otpGenerator = require("otp-generator");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ahmedsaud1999@gmail.com",
    pass: "ddnc antd dcub iyzr",
  },
});

const generatedOTP = () => {
  return crypto.randomBytes(2).toString("hex").toUpperCase();
};

const forgotPassword = (req,res,next)=>{
    const email = req.body.email;
    console.log(email);
    
    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    const mailOptions ={
        from:'ahmedsaud1999@gmail.com',
        to : email,
        subject:"Reset your passcode",
        text:`Your Otp for resseting password is ${otp}`
    };

    transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
            console.log(error);
            return res.status(500).json({message:"Failed to send OTP"})
        } else{
            console.log('email sent: '+info.response);
            req.generatedOTP = otp;
            req.email = email;
            next();
        };
    });


}

module.exports = forgotPassword