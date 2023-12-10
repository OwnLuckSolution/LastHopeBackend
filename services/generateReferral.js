function generateReferralCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const codeLength = 6;
  let referralCode = '';

  for (let i = 0; i < codeLength; i++) {
    referralCode += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return referralCode;
}
module.exports = generateReferralCode;