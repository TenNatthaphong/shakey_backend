import { PrismaClient } from '@prisma/client';

async function main() {
    const prisma = new PrismaClient();
    const user = await prisma.user.findFirst();
    console.log('USER_ID:', user?.user_id);
    await prisma.$disconnect();
}

main().catch(console.error);
