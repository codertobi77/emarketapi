import { withRole } from '@/app/middleware/withRole';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export const GET = withRole(['ADMIN'], async (req: NextRequest, context) => {
  const id = context.params.id;

  if (!id) {
    return Response.json({ error: 'ID is required' }, { status: 400 });
  }

  const acheteur = await prisma.user.findUnique({
    where: { id, role: 'ACHETEUR' },
    include: { Acheteur: true },
  });

  if (!acheteur) {
    return Response.json({ error: 'Acheteur not found' }, { status: 404 });
  }

  return Response.json(acheteur);
});

export const PUT = withRole(['ADMIN'], async (req: NextRequest, context) => {
      const { id } = context.params;
      const { email, password, adresse } = await req.json();
  
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          email,
          password,
          Acheteur: {
            
          },
        },
        include: {
          Acheteur: true,
        },
      });
  
      return Response.json(updatedUser);
    });

    export const DELETE = withRole(['ADMIN'], async (_req, context) => {
        const { id } = context.params;
    
        await prisma.acheteur.deleteMany({ where: { userId: id } });
        await prisma.user.delete({ where: { id } });
    
        return Response.json({ message: 'Acheteur supprimé avec succès.' });
      });
