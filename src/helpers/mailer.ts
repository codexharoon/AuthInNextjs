import nodemailer from "nodemailer";
import User from "@/models/usermodel";
import bcryptjs from "bcryptjs";

var transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

export const sendMail = async ({ type, email, id }: any) => {
  try {
    const user = await User.findById(id);

    if (!user) {
      return;
    }

    const token = await bcryptjs.hash(email, 10);

    user.isVerifiedToken = token;
    user.isVerifiedTokenExpiry = new Date(Date.now() + 3600000);

    await user.save();

    const info = await transporter.sendMail({
      from: "info@codexharoon.com", // sender address
      to: email, // list of receivers
      subject:
        type === "VERIFY" ? "Verify your account" : "Reset your password", // Subject line
      text: type, // plain text body
      html: `<b>${
        type === "VERIFY" ? "Verify your account" : "Reset your password"
      }</b> <br> <a href="${process.env.DOMAIN}/${
        type === "VERIFY" ? "verify" : "reset"
      }/${token}">Click here to ${type === "VERIFY" ? "verify" : "reset"}</a>`, // html body
    });
  } catch (err) {
    console.log(err);
  }
};
