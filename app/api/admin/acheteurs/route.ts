import { withRole } from '@/app/middleware/withRole';
import { prisma } from '@/lib/prisma';

export const GET = withRole(['ADMIN'], async (req) => {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const skip = (page - 1) * limit;

  const emailFilter = searchParams.get('email') || '';
  const adresseFilter = searchParams.get('nom') || '';

  const [acheteurs, total] = await Promise.all([
    prisma.user.findMany({
      where: {
        role: 'ACHETEUR',
        email: { contains: emailFilter, mode: 'insensitive' },
        Acheteur: {
    
        },
      },
      include: { Acheteur: true },
      skip,
      take: limit,
      orderBy: { email: 'asc' },
    }),
    prisma.user.count({
      where: {
        role: 'ACHETEUR',
        email: { contains: emailFilter, mode: 'insensitive' },
        Acheteur: {
          
        },
      },
    }),
  ]);

  return Response.json({
    data: acheteurs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
});
