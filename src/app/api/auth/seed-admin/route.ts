// app/api/auth/seed-admin/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongodb";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

export async function POST(_req: NextRequest) {
  await dbConnect();
  const email = "admin@admin.com";
  const exists = await User.findOne({ email });
  if (exists) {
    return NextResponse.json({ ok: true, message: "Admin já existe" });
  }
  const hash = await bcrypt.hash("admin123", 10);
  await User.create({ name: "Admin", email, password: hash, role: "admin" });
  return NextResponse.json({
    ok: true,
    message: "Admin criado: admin@admin.com / admin123",
  });
}
