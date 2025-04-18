import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token manquant' }, { status: 400 });
  }

  const user = await prisma.user.findFirst({ where: { emailVerifyToken: token } });

  if (!user) {
    return NextResponse.json({ error: 'Token invalide' }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      emailVerifyToken: null,
    },
  });

  return NextResponse.json({ message: 'Email vérifié avec succès !' });
}
