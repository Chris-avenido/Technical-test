import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const DEMO_USER_ID = 'demo-user-1';
export const DEMO_USER_EMAIL = 'demo@example.com';

async function main() {
  console.log('Seeding demo user into MySQL database...');

  const user = await prisma.user.upsert({
    where: { email: DEMO_USER_EMAIL },
    update: {},
    create: {
      id: DEMO_USER_ID,
      email: DEMO_USER_EMAIL,
      name: 'Demo Reviewer',
      subscriptionStatus: 'INACTIVE',
    },
  });

  console.log('Demo user seeded successfully:', user);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
