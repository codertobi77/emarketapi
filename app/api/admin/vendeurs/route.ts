import { withRole } from '@/app/middleware/withRole';
import { prisma } from '@/lib/prisma';

export const GET = withRole(['ADMIN'], async (req) => {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const skip = (page - 1) * limit;

  const emailFilter = searchParams.get('email') || '';
  const entrepriseFilter = searchParams.get('entreprise') || '';

  const [vendeurs, total] = await Promise.all([
    prisma.user.findMany({
      where: {
        role: 'VENDEUR',
        email: { contains: emailFilter, mode: 'insensitive' },
        Vendeur: {
          boutique: { contains: entrepriseFilter, mode: 'insensitive' },
        },
      },
      include: {
        Vendeur: true,
      },
      skip,
      take: limit,
      orderBy: {
        email: 'asc',
      },
    }),
    prisma.user.count({
      where: {
        role: 'VENDEUR',
        email: { contains: emailFilter, mode: 'insensitive' },
        Vendeur: {
          boutique: { contains: entrepriseFilter, mode: 'insensitive' },
        },
      },
    }),
  ]);

  return Response.json({
    data: vendeurs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
});
