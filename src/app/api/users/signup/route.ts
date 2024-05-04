import User from "@/models/usermodel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendMail } from "@/helpers/mailer";
import { connectDB } from "@/helpers/dbConfig";

connectDB();

export async function POST(req: NextRequest) {
  try {
    const { username, email, password }: any = await req.json();

    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
      return NextResponse.json({ message: "User already exists" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hasPass = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hasPass,
    });

    const savedUser = await newUser.save();

    await sendMail({ type: "VERIFY", email, id: savedUser._id });

    return NextResponse.json({
      message: "User created successfully",
      user: savedUser,
      success: true,
    });
  } catch (e: any) {
    return NextResponse.json({
      message: "Something went wrong",
      success: false,
      error: e.message,
    });
  }
}
