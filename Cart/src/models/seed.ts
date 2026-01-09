import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // clear old data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.stock.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.supplier.deleteMany();

  // create Users
  const alice = await prisma.user.create({ data: { name: "Alice", email: "alice@gmail.com", point: 1000 } });
  const ayu = await prisma.user.create({ data: { name: "Ayu", email: "ayu@gmail.com", point: 500 } });
  const andini = await prisma.user.create({ data: { name: "Andini", email: "andini@gmail.com", point: 0 } });

  // create Suppliers
  const passwordHash = await bcrypt.hash("supplier123", 10);
  const techSupply = await prisma.supplier.create({
    data: {
      name: "TechSupply Inc",
      email: "contact@techsupply.com",
      password: passwordHash
    }
  });
  const gadgetWorld = await prisma.supplier.create({
    data: {
      name: "GadgetWorld",
      email: "sales@gadgetworld.com",
      password: passwordHash
    }
  });

  // create Products (Owned by TechSupply)
  const keyboard = await prisma.product.create({
    data: {
      name: "Keyboard",
      price: 350000,
      stock: 10,
      description: "A mechanical keyboard with RGB lighting.",
      ownerId: techSupply.id
    }
  });
  const mouse = await prisma.product.create({
    data: {
      name: "Mouse",
      price: 30000,
      stock: 15,
      description: "A wireless mouse with high precision sensor.",
      ownerId: techSupply.id
    }
  });
  const monitor = await prisma.product.create({
    data: {
      name: "Monitor",
      price: 700000,
      stock: 20,
      description: "A 24-inch IPS monitor with 144Hz refresh rate.",
      ownerId: gadgetWorld.id
    }
  });
  const laptop = await prisma.product.create({
    data: {
      name: "Laptop",
      price: 8050000,
      stock: 5,
      description: "A powerful laptop for gaming and work.",
      ownerId: gadgetWorld.id
    }
  });

  const orderData = [
    { user: alice, product: keyboard, quantity: 2 },
    { user: alice, product: mouse, quantity: 1 },
    { user: ayu, product: monitor, quantity: 1 },
    { user: andini, product: laptop, quantity: 4 },
  ];

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

  console.log("seeding completed");
}

main()
  .then(() => {
    // success
  })
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
