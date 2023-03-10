import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function seed() {
  const user = await db.user.create({
    data: {
      name: 'Saaratha Searingheart',
      email: 'email-1@email.com',
      hashedPassword: 'abc123',
      username: 'searingheart',
      type: 'AGENCY',
    },
  });

  await Promise.all(
    getPets().map((pet) => {
      return db.pet.create({
        data: {
          ...pet,
          agencyId: user.id,
        },
      });
    })
  );
}

seed();

function getPets() {
  return [
    {
      name: 'comet',
      species: 'dog',
    },
    {
      name: 'spam',
      species: 'dog',
    },
    {
      name: 'pudding',
      species: 'cat',
    },
  ];
}
