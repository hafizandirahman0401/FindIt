
const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcryptjs");
const readline = require("readline");

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  const email = "adminfindit26@gmail.com";

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    console.log("Email tersebut sudah terdaftar.");
    return;
  }

  const password = await new Promise((resolve) => {
    rl.question("Buat password Admin FindIt: ", resolve);
  });

  if (password.length < 12) {
    console.log("Password minimal 12 karakter.");
    return;
  }

  const hashedPassword = await hash(password, 12);

  await prisma.user.create({
    data: {
      nama: "Admin FindIt",
      email,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Akun Admin FindIt berhasil dibuat!");
  console.log("Email:", email);
  console.log("Role: ADMIN");
}

main()
  .catch((error) => {
    console.error("Gagal membuat akun:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    rl.close();
    await prisma.$disconnect();
  });
