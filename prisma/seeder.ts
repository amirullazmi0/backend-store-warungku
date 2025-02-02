import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

const prisma = new PrismaClient();
const jwt = new JwtService({
  secret: 'mysecret-warungku-bosdannis',
});

async function main() {
  // Membuat Alamat
  const alamat = await prisma.address.create({
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

  // Membuat User Super Admin
  const userSuper = await prisma.user.create({
    data: {
      email: 'super0@gmail.com',
      name: 'Super Admin',
      password: await bcrypt.hash('super0@gmail.com', 10),
      rolesName: 'super',
      refreshToken: jwt.sign({ email: 'super0@gmail.com' }),
      addressId: alamat.id,
    },
  });

  // Menyimpan Relasi User dengan Alamat
  await prisma.userAddress.create({
    data: {
      userId: userSuper.id,
      addressId: alamat.id,
    },
  });

  // Menambahkan Kategori untuk E-Commerce & Bahan Dapur
  const kategori = [
    { name: 'Elektronik' }, // Electronics
    { name: 'Fashion' }, // Fashion
    { name: 'Peralatan Rumah Tangga' }, // Home & Living
    { name: 'Kesehatan & Kecantikan' }, // Beauty & Health
    { name: 'Olahraga & Outdoor' }, // Sports & Outdoors
    { name: 'Otomotif' }, // Automotive
    { name: 'Buku & Alat Tulis' }, // Books & Stationery
    { name: 'Mainan & Permainan' }, // Toys & Games
    { name: 'Handphone & Aksesoris' }, // Mobile Phones & Accessories
    { name: 'Komputer & Laptop' }, // Computers & Laptops
    { name: 'Perhiasan & Jam Tangan' }, // Jewelry & Watches

    // **Kategori Bahan Dapur & Kebutuhan Sehari-hari**
    { name: 'Bahan Dapur' }, // Cooking Ingredients
    { name: 'Buah & Sayur Segar' }, // Fresh Produce
    { name: 'Daging & Seafood' }, // Meat & Seafood
    { name: 'Susu, Telur & Produk Susu' }, // Dairy & Eggs
    { name: 'Kebutuhan Baking' }, // Baking Needs
    { name: 'Makanan Beku' }, // Frozen Food
    { name: 'Minuman' }, // Beverages
    { name: 'Makanan Ringan & Camilan' }, // Snacks & Sweets
    { name: 'Bumbu & Rempah' }, // Spices & Seasonings
    { name: 'Beras, Minyak & Gula' }, // Rice, Oil & Sugar

    // **Kategori Kebutuhan Rumah Tangga**
    { name: 'Alat Masak & Dapur' }, // Kitchen Essentials
    { name: 'Peralatan Kebersihan' }, // Cleaning & Laundry
    { name: 'Perlengkapan Bayi & Anak' }, // Baby & Kids
    { name: 'Kesehatan & Perawatan Tubuh' }, // Health & Wellness
    { name: 'Kebutuhan Hewan Peliharaan' }, // Pet Supplies
  ];

  // Menyimpan Kategori ke Database
  await prisma.category.createMany({
    data: kategori,
  });

  console.log('Seeding selesai! Data kategori dan admin telah dibuat.');
}

// Menjalankan Skrip
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
