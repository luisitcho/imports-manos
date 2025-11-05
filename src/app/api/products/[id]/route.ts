// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { verifyJwt } from "@/lib/jwt";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const prod = await Product.findById(params.id);
  if (!prod)
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  return NextResponse.json(prod);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const token = req.cookies.get("token")?.value;
  const user = token ? verifyJwt<{ role: string }>(token) : null;
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const data = await req.json();
  const updated = await Product.findByIdAndUpdate(params.id, data, {
    new: true,
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const token = req.cookies.get("token")?.value;
  const user = token ? verifyJwt<{ role: string }>(token) : null;
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  await Product.findByIdAndDelete(params.id);
  return NextResponse.json({ ok: true });
}
