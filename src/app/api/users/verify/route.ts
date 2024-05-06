import { NextRequest, NextResponse } from "next/server";
import User from "@/models/usermodel";
import { connectDB } from "@/helpers/dbConfig";

connectDB();

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const user = await User.findOne({
      isVerifiedToken: token,
      isVerifiedTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid User or Link has been expired!" },
        { status: 400 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json({ message: "User already verified" });
    }

    user.isVerified = true;

    user.isVerifiedToken = undefined;
    user.isVerifiedTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({ message: "User verified successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
