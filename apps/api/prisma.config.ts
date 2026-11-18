import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url:
      process.env.DATABASE_URL ||
      "postgresql://ana_orthodox:ana_orthodox_secret@localhost:5432/ana_orthodox_dev?schema=public",
  },
});
