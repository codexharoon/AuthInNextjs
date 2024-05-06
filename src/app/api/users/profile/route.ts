import { connectDB } from "@/helpers/dbConfig";
import { getTokenDataFromCookie } from "@/helpers/getTokenDataFromCookie";
import User from "@/models/usermodel";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(req: NextRequest) {
  try {
    const data: any = await getTokenDataFromCookie(req);

    if (!data) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(data.id).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user,
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
