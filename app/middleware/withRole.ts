import { NextRequest } from 'next/server';
import { withAuth } from './withAuth';

type Handler = (req: NextRequest, context?: any) => Promise<Response>;

export function withRole(allowedRoles: string[], handler: Handler): Handler {
  return withAuth(async (req, context) => {
    const user = context?.user;

    if (!user) {
      return Response.json({ error: 'Unauthorized', message: 'Utilisateur non authentifié' }, { status: 401 });
    }

    if (!allowedRoles.includes(user.role)) {
      return Response.json({ error: 'Forbidden', message: `Rôle '${user.role}' non autorisé` }, { status: 403 });
    }

    return handler(req, context);
  });
}
