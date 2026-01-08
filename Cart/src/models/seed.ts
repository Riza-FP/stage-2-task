import { PrismaClient } from "@prisma/client";

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

  // create Products
  const keyboard = await prisma.product.create({ data: { name: "Keyboard", price: 350000, stock: 10, description: "A mechanical keyboard with RGB lighting." } });
  const mouse = await prisma.product.create({ data: { name: "Mouse", price: 30000, stock: 15, description: "A wireless mouse with high precision sensor." } });
  const monitor = await prisma.product.create({ data: { name: "Monitor", price: 700000, stock: 20, description: "A 24-inch IPS monitor with 144Hz refresh rate." } });
  const laptop = await prisma.product.create({ data: { name: "Laptop", price: 8050000, stock: 5, description: "A powerful laptop for gaming and work." } });

  // create Suppliers
  const techSupply = await prisma.supplier.create({ data: { name: "TechSupply Inc", email: "contact@techsupply.com" } });
  const gadgetWorld = await prisma.supplier.create({ data: { name: "GadgetWorld", email: "sales@gadgetworld.com" } });

  const users = [alice, ayu, andini];
  const products = [keyboard, mouse, monitor, laptop];

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
