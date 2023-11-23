const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user:"ahmedsaud1999@gmail.com",
        pass:"ddnc antd dcub iyzr",
    }
});

const sendVerificationEmail = async (email, otp) => {
    try {
        const mailOptions = {
            from: "ahmedsaud1999@gmail.com",
            to: email,
            subject: "Email OTP verification",
            html: `<p>Your verification otp is: ${otp}</p>`,
        };
        await transporter.sendMail(mailOptions);
        return { success: true, message: "Verification email sent successfully" };
    } catch (error) {
        console.error("Error sending verification email:", error);
        return { success: false, message: "Error sending verification email" };
    }
};

module.exports = {
    sendVerificationEmail
};
