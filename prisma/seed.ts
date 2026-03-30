
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

  console.log(`Creating user.`);
  await prisma.user.create({
    data: {
        email: ADMIN_EMAIL,
        password: await bcrypt.encryptPassword(ADMIN_PASSWORD),
        role: 'ADMIN',
        status: 'ACTIVE',
        created_at: new Date()
    }
  })

  console.log('Creating default services')

  await prisma.service.createMany({
    data: [
      {
        code: 'video-otoscopia',
        name: 'Video otoscopía',
        description: 'Examen que permite observar el interior del oído mediante una cámara de alta definición',
        price: 22000,
      },
      {
        code: 'limpieza-oido',
        name: 'Limpieza de oído',
        description: 'Procedimiento destinado a eliminar tapones de cerumen acumulado en el conducto auditivo, ayudando a mejorar la audición y aliviar molestias como sensación de oído tapado',
        price: 20000,
      },
      {
        code: 'rehabilitacion-vestibular',
        name: 'Rehabilitación vestibular',
        description: 'Terapia basada en ejercicios específicos que ayudan a disminuir el mareo y el vértigo, mejorando el equilibrio y la estabilidad en las actividades diarias, Requieren indicación médica previa',
        price: 20000,
      },
      {
        code: 'vppb',
        name: 'Maniobras de reposicionamiento',
        description: 'Procedimientos específicos utilizados para tratar el vértigo posicional, mediante movimientos guiados de la cabeza que permiten recolocar las partículas del oído interno en su posición correcta. Requieren indicación médica previa',
        price: 25000,
      },
    ]
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