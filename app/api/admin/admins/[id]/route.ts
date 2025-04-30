import { withRole } from '@/app/middleware/withRole';
import {prisma} from '@/lib/prisma';
import { NextRequest } from 'next/server';

export const PUT = withRole(['ADMIN'], async (req: NextRequest, context) => {
    const { id } = context.params;
    const { email, password, droits } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        email,
        password,
        Admin: {
          
        },
      },
      include: {
        Admin: true,
      },
    });

    return Response.json(updatedUser);
  });

  export const DELETE = withRole(['ADMIN'], async (_req, context) => {
    const { id } = context.params;

    await prisma.admin.deleteMany({ where: { userId: id } });
    await prisma.user.delete({ where: { id } });

    return Response.json({ message: 'Admin supprimé avec succès.' });
  });
