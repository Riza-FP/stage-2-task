import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();

    // Create Users
    const passwordHash = await bcrypt.hash("password123", 10);
    const adminHash = await bcrypt.hash("admin123", 10);

    const alice = await prisma.user.create({
        data: {
            name: "Alice",
            email: "alice@example.com",
            password: passwordHash,
            role: "user"
        },
    });

    const bob = await prisma.user.create({
        data: {
            name: "Bob",
            email: "bob@example.com",
            password: passwordHash,
            role: "user"
        },
    });

    const charlie = await prisma.user.create({
        data: {
            name: "Charlie",
            email: "charlie@example.com",
            password: adminHash,
            role: "admin"
        },
    });

    // Create Posts
    const post1 = await prisma.post.create({
        data: {
            title: "Introduction to Prisma",
            content: "Prisma is a great ORM for TypeScript.",
            userId: alice.id,
        },
    });

    const post2 = await prisma.post.create({
        data: {
            title: "My First Blog Post",
            content: "Hello world! This is Bob's first post.",
            userId: bob.id,
        },
    });

    const post3 = await prisma.post.create({
        data: {
            title: "Advanced TypeScript Tips",
            content: "Here are some tips for using TypeScript effectively...",
            userId: alice.id,
        },
    });

    // Create Comments
    // Post 1 comments (for pagination testing)
    const commentsData = [
        { content: "Great introduction!", userId: bob.id, postId: post1.id },
        { content: "Very helpful, thanks!", userId: charlie.id, postId: post1.id },
        { content: "I love Prisma too.", userId: alice.id, postId: post1.id },
        { content: "Can you cover relations next?", userId: charlie.id, postId: post1.id },
        { content: "Waiting for Part 2.", userId: bob.id, postId: post1.id },
        { content: "Welcome to the blogosphere, Bob!", userId: alice.id, postId: post2.id },
        { content: "Nice start.", userId: charlie.id, postId: post2.id },
    ];

    for (const comment of commentsData) {
        await prisma.comment.create({ data: comment });
    }

    console.log("🌱 Blog seeding completed");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
