import { withRole } from '@/app/middleware/withRole';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export const GET = withRole(['ADMIN'], async (req: NextRequest, context) => {
  const id = context.params.id;

  if (!id) {
    return Response.json({ error: 'ID is required' }, { status: 400 });
  }

  const gestionnaire = await prisma.user.findUnique({
    where: { id, role: 'GESTIONNAIRE' },
    include: { Gestionnaire: true },
  });

  if (!gestionnaire) {
    return Response.json({ error: 'Gestionnaire not found' }, { status: 404 });
  }

  return Response.json(gestionnaire);
});

export const PUT = withRole(['ADMIN'], async (req: NextRequest, context) => {
      const { id } = context.params;
      const { email, password, region } = await req.json();
  
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          email,
          password,
          Gestionnaire: {
            
          },
        },
        include: {
          Gestionnaire: true,
        },
      });
  
      return Response.json(updatedUser);
    });

    export const DELETE = withRole(['ADMIN'], async (_req, context) => {
        const { id } = context.params;
    
        await prisma.gestionnaire.deleteMany({ where: { userId: id } });
        await prisma.user.delete({ where: { id } });
    
        return Response.json({ message: 'Gestionnaire supprimé avec succès.' });
      });
