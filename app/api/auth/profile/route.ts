import { prisma } from "@/lib/prisma";
import { withAuth } from '@/app/middleware/withAuth';

export const GET = withAuth(async (req, context) => {
  const email = context.user.email;

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      Acheteur: true,
      Vendeur: true,
      Admin: true,
      Gestionnaire: true,
    },
  });

  return Response.json({
    message: 'Accès autorisé',
    user,
  });
});

