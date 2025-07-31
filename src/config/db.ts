import { PrismaClient } from "@prisma/client";

export async function testDbConnection() {
    try {
        await prisma.$connect();
        console.log("Database connection successful");
    } catch (error) {
        console.error("Database connection failed:", error);
        throw error;
    }finally{
        await prisma.$disconnect();
    }
}

export const prisma = new PrismaClient();