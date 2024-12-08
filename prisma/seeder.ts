import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

const prisma = new PrismaClient();
const jwt = new JwtService({
  secret: 'mysecret-warungku-bosdannis',
});

async function main() {
  const address = await prisma.address.create({
    data: {
      jalan: 'Jl. Mawar No. 5',
      rt: '001',
      rw: '002',
      kodepos: '12345',
      kelurahan: 'Kelurahan A',
      kecamatan: 'Kecamatan B',
      kota: 'Kota C',
      provinsi: 'Provinsi D',
      active: true,
    },
  });

  const userSuper = await prisma.user.create({
    data: {
      email: 'super0@gmail.com',
      name: 'Super Admin',
      password: await bcrypt.hash('super0@gmail.com', 10),
      rolesName: 'super',
      refreshToken: jwt.sign({ email: 'super0@gmail.com' }),
      addressId: address.id,
    },
  });

  await prisma.userAddress.create({
    data: {
      userId: userSuper.id,
      addressId: address.id,
    },
  });

  console.log('Seeding completed!');
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
