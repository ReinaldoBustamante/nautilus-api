
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/client';
import { BcryptAdapter } from 'src/common/adapters/bcrypt.adapter';

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter: pool });
const bcrypt = new BcryptAdapter()

async function main() {
  console.log(`Start seeding ...`);
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL) throw new Error('ADMIN_EMAIL is required');
  if (!ADMIN_PASSWORD) throw new Error('ADMIN_PASSWORD is required');

  await prisma.user.create({
    data: {
        email: ADMIN_EMAIL,
        password: await bcrypt.encryptPassword(ADMIN_PASSWORD),
        role: 'ADMIN',
        status: 'ACTIVE',
        created_at: new Date()
    }
  })

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });