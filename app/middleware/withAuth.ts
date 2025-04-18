import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

type handler = ( req: NextRequest, context?: any ) => Promise<Response>;

export function withAuth(handler: handler) : handler {
    return async (req, context) => {
        let token = req.headers.get('Authorization')?.split(' ')[1];

        // 2. Sinon dans le cookie “auth_token”
        if (!token) {
        token = req.cookies.get('auth_token')?.value;
        }

        if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        try {
            const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!);
            return handler(req, { ...context, user: decoded });
        } catch (error) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

    }
}
