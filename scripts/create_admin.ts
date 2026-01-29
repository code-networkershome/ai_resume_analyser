
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const prisma = new PrismaClient();

async function main() {
    const email = "vikas@networkershome.com";
    const password = crypto.randomBytes(8).toString("hex"); // Generate random 16-char password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            console.log(`User ${email} already exists.`);
            console.log("Updating password...");
            await prisma.user.update({
                where: { email },
                data: { password: hashedPassword },
            });
        } else {
            console.log(`Creating user ${email}...`);
            await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name: "Vikas",
                },
            });
        }

        console.log("\n===========================================");
        console.log("USER CREATED / UPDATED SUCCESSFULLY");
        console.log("===========================================");
        console.log(`Email:    ${email}`);
        console.log(`Password: ${password}`);
        console.log("===========================================\n");

    } catch (e) {
        console.error(e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
