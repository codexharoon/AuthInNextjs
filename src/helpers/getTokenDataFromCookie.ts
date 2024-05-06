import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getTokenDataFromCookie = async (req: NextRequest) => {
  try {
    const token: any = req.cookies.get("token")?.value;

    const data = jwt.verify(token, process.env.JWT_SECRET!);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
