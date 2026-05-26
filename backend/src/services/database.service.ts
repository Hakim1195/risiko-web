import { PrismaClient } from '@prisma/client';

// Création d'une instance unique du client Prisma
const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

export default prisma;
