import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serialize } from "cookie";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";

export async function POST(request: Request) {
  const { email, password, rememberMe } = await request.json();
  

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      Acheteur: true,
      Vendeur: true,
      Admin: true,
      Gestionnaire: true,
    },
  });

  

  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
  }

  if (!user.emailVerified) {
    return NextResponse.json({ error: "Email non vérifié" }, { status: 403 });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
  }

  const token = sign({ id: user.id, email: user.email, role: user.role }, process.env.NEXTAUTH_SECRET!, { expiresIn: rememberMe ? "30d" : "2h", });

  const cookie = serialize("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 2, // 30j vs 2h
    path: "/",
    sameSite: "lax",
  });

  return NextResponse.json(
    { message: "Connecté", token },
    { status: 200, headers: { "Set-Cookie": cookie } }
  );
}

