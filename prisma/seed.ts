import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'
import { BcryptAdapter } from 'src/auth/adapters/bcrypt.adapter'
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) })
async function main() {
    const { ADMIN_EMAIL, ADMIN_PASSWORD, DATABASE_URL } = process.env;

    if (!DATABASE_URL) throw new Error('DATABASE_URL is required');
    if (!ADMIN_EMAIL) throw new Error('ADMIN_EMAIL is required');
    if (!ADMIN_PASSWORD) throw new Error('ADMIN_PASSWORD is required');

    const existingUser = await prisma.user.findFirst({
        where: { email: ADMIN_EMAIL },
    });

    if (existingUser) {
        console.log('Admin user already exists');
        return
    }

    await prisma.user.create({
        data: {
            email: ADMIN_EMAIL,
            password: await new BcryptAdapter().encryptPassword(ADMIN_PASSWORD),
            user_role: 'admin',
            user_status: 'active'
        }

    })
    console.log('Admin user created successfully');

}
main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });