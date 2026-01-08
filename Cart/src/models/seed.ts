import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Uncomment if you want to reset the database
  // await prisma.orderItem.deleteMany();
  // await prisma.order.deleteMany();
  // await prisma.product.deleteMany();
  // await prisma.user.deleteMany();

  // Create users
  const alice = await prisma.user.create({
    data: { name: "Alice", email: "alice@gmail.com" },
  });

  const ayu = await prisma.user.create({
    data: { name: "Ayu", email: "ayu@gmail.com" },
  });

  const andini = await prisma.user.create({
    data: { name: "Andini", email: "andini@gmail.com" },
  });

  // Create products
  const keyboard = await prisma.product.create({
    data: {
      name: "Keyboard",
      price: 350000,
      stock: 10,
      description: "A mechanical keyboard with RGB lighting.",
    },
  });

  const mouse = await prisma.product.create({
    data: {
      name: "Mouse",
      price: 30000,
      stock: 15,
      description: "A wireless mouse with high precision sensor.",
    },
  });

  const monitor = await prisma.product.create({
    data: {
      name: "Monitor",
      price: 700000,
      stock: 20,
      description: "A 24-inch IPS monitor with 144Hz refresh rate.",
    },
  });

  const laptop = await prisma.product.create({
    data: {
      name: "Laptop",
      price: 8050000,
      stock: 5,
      description: "A powerful laptop for gaming and work.",
    },
  });

  const orderData = [
    { user: alice, product: keyboard, quantity: 2 },
    { user: alice, product: mouse, quantity: 1 },
    { user: ayu, product: monitor, quantity: 1 },
    { user: andini, product: laptop, quantity: 4 },
  ];

  // Create orders
  for (const item of orderData) {
    await prisma.order.create({
      data: {
        userId: item.user.id,
        items: {
          create: {
            productId: item.product.id,
            quantity: item.quantity,
          },
        },
      },
    });
  }

  console.log("Seeding completed");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
