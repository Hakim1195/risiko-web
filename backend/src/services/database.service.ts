import { PrismaClient } from '@prisma/client/extension';

// Création d'une instance unique du client Prisma
const prisma = new PrismaClient();

export default prisma;
