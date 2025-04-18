// app/api/auth/logout/route.ts

import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  // On « vide » le cookie JWT en le ré-expirant immédiatement
  const expiredCookie = serialize('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
    expires: new Date(0),
  });

  return NextResponse.json(
    { message: 'Déconnecté avec succès' },
    {
      status: 200,
      headers: {
        // En-tête pour écraser le cookie sur le client
        'Set-Cookie': expiredCookie,
      },
    }
  );
}
