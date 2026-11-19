import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  public isConnected = false;
  private pool?: Pool;

  constructor() {
    const connectionString =
      process.env.DATABASE_URL ||
      "postgresql://ana_orthodox:ana_orthodox_secret@localhost:5432/ana_orthodox_dev?schema=public";
    const pool = new Pool({
      connectionString,
      connectionTimeoutMillis: 2000,
    });
    const adapter = new PrismaPg(pool);
    super({ adapter });
    this.pool = pool;
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.isConnected = true;
      this.logger.log("Connected to PostgreSQL database via Prisma 7 & PrismaPg adapter.");
    } catch (err) {
      this.isConnected = false;
      if (process.env.NODE_ENV === "production") throw new Error("PostgreSQL connection is required in production");
      this.logger.warn(
        `PostgreSQL not reachable on port 5432 (Will connect when container is started): ${(err as Error).message}`
      );
    }
  }

  async onModuleDestroy() {
    if (this.isConnected) {
      await this.$disconnect();
    }
    if (this.pool) {
      await this.pool.end();
    }
  }
}
