import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { sendEmailVerification } from "@/lib/email";

export async function POST(request: Request) {
  const { email, password, role, roleSpecificData } = await request.json();

  const validRoles = ['ACHETEUR', 'VENDEUR', 'ADMIN', 'GESTIONNAIRE'];
  if (!validRoles.includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role,
      firstName, 
      lastName,  
    },
  });

  if (role === 'VENDEUR') {
    await prisma.vendeur.create({
      data: {
        userId: user.id,
        boutique: roleSpecificData.boutique,
      },
    });
  } else if (role === 'ACHETEUR') {
    await prisma.acheteur.create({
      data: {
        userId: user.id,
        adresse: roleSpecificData.adresse,
      },
    });
  } else if (role === 'ADMIN') {
    await prisma.admin.create({
      data: {
        userId: user.id,
        droits: roleSpecificData.droits,
      },
    });
  } else if (role === 'GESTIONNAIRE') {
    await prisma.gestionnaire.create({
      data: {
        userId: user.id,
        region: roleSpecificData.region,
      },
    });
  }

  await sendEmailVerification(user.id, email);


  return NextResponse.json({ message: "User created successfully" });
}
