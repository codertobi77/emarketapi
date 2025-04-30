import { withRole } from '@/app/middleware/withRole';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

export const GET = withRole(['ADMIN'], async (req: NextRequest, context) => {
  const id = context.params.id;

  if (!id) {
    return Response.json({ error: 'ID is required' }, { status: 400 });
  }

  const vendeur = await prisma.user.findUnique({
    where: { id, role: 'VENDEUR' },
    include: { Vendeur: true },
  });

  if (!vendeur) {
    return Response.json({ error: 'Vendeur not found' }, { status: 404 });
  }

  return Response.json(vendeur);
});


export const PUT = withRole(["ADMIN"], async (req: NextRequest, context) => {
  const { id } = context.params;
  const body = await req.json();
  const { email, boutique } = body;

  // Vérifie d'abord si le vendeur existe
  const vendeur = await prisma.vendeur.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!vendeur) {
    return new Response(JSON.stringify({ error: "Vendeur non trouvé" }), { status: 404 });
  }

  // Mise à jour des données
  await prisma.vendeur.update({
    where: { id },
    data: {
      boutique: boutique ?? vendeur.boutique,
      user: {
        
      },
    },
  });

  return new Response(JSON.stringify({ message: "Vendeur mis à jour avec succès" }), { status: 200 });
});

export const DELETE = withRole(['ADMIN'], async (_req, context) => {
      const { id } = context.params;
  
      await prisma.vendeur.deleteMany({ where: { userId: id } });
      await prisma.user.delete({ where: { id } });
  
      return Response.json({ message: 'Vendeur supprimé avec succès.' });
    });

