import nodemailer from "nodemailer";
import User from "@/models/usermodel";
import bcryptjs from "bcryptjs";
import { connectDB } from "@/helpers/dbConfig";

connectDB();

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
    const token = await bcryptjs.hash(email, 10);

    if (type === "VERIFY") {
      const user = await User.findByIdAndUpdate(id, {
        isVerifiedToken: token,
        isVerifiedTokenExpiry: Date.now() + 3600000,
      });

      if (!user) {
        return;
      }

      await user.save();
    } else if (type === "RESET") {
      const user = await User.findByIdAndUpdate(id, {
        forgotPasswordToken: token,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });

      if (!user) {
        return;
      }

      await user.save();
    }

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
