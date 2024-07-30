const { google } = require("googleapis");
const nodemailer = require("nodemailer");

const GOOGLE_CALL_BACK_URL = process.env.GOOGLE_CALL_BACK_URL;
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  GOOGLE_CALL_BACK_URL
);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendMail = async (to, subject, html) => {
  const accessToken = await oauth2Client.getAccessToken();
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_USER,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: accessToken.token,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: to,
    subject: subject,
    html: html,
  });

  return info;
};

module.exports = {
  sendMail,
};
