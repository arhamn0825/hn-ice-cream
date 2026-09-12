import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";

// A second, separate lock on top of your normal admin login — even if
// someone else has your admin username/password, they still can't open
// Sweet Reset without this PIN, which only lives in your private .env file.
export async function POST(req: NextRequest) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { pin } = await req.json();
  const correctPin = process.env.OWNER_RESET_PIN;

  if (!correctPin || pin !== correctPin) {
    return NextResponse.json({ error: "Incorrect PIN" }, { status: 403 });
  }

  return NextResponse.json({ success: true });
}
