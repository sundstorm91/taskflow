import { PrismaClient } from "../lib/generated/prisma/client"
import { PrismaSqlite } from "prisma-adapter-sqlite"

const adapter = new PrismaSqlite({
  url: process.env.DATABASE_URL!,
})

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter,
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma