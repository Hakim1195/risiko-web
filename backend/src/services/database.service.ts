import { PrismaClient } from '@prisma/client';

// Création d'une instance unique du client Prisma
const prisma = new PrismaClient();

export default prisma;
