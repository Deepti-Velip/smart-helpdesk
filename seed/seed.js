import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB  connected");

    const { default: User } = await import("../server/models/user.js");
    const { default: KBArticle } = await import("../server/models/kb.js");
    const { default: Ticket } = await import("../server/models/Ticket.js");

    await Promise.all([
      User.deleteMany(),
      KBArticle.deleteMany(),
      Ticket.deleteMany(),
    ]);

    await User.create([
      {
        name: "Admin",
        email: "admin@test.com",
        password: "hashedpw",
        role: "admin",
      },
      {
        name: "Agent",
        email: "agent@test.com",
        password: "hashedpw",
        role: "agent",
      },
      {
        name: "User",
        email: "user@test.com",
        password: "hashedpw",
        role: "user",
      },
    ]);

    await KBArticle.create([
      {
        title: "Troubleshooting 500 errors",
        body: "Steps to fix server errors",
        tags: ["tech"],
      },
      {
        title: "Refund Policy",
        body: "Refunds explained",
        tags: ["billing"],
      },
    ]);

    await Ticket.create([
      {
        title: "Login issue",
        description: "Error 403 on login",
        category: "tech",
        status: "open",
      },
    ]);

    console.log("Seed data inserted");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding data:", err.message);
    process.exit(1);
  }
}

seed();
