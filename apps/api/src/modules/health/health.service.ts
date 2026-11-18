import { Injectable, Logger } from "@nestjs/common";
import * as net from "net";
import {
  HealthStatusResponse,
  LivenessResponse,
  ReadinessResponse,
  DependencyStatus,
} from "@ana-orthodox/shared-types";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Helper to perform a real TCP socket connectivity probe.
   * Ensures Redis is actively verified over the network, not assumed from environment variables.
   */
  private probeTcp(host: string, port: number, timeoutMs = 1500): Promise<boolean> {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      let settled = false;

      const finish = (result: boolean) => {
        if (!settled) {
          settled = true;
          socket.destroy();
          resolve(result);
        }
      };

      socket.setTimeout(timeoutMs);
      socket.on("connect", () => finish(true));
      socket.on("timeout", () => finish(false));
      socket.on("error", () => finish(false));

      try {
        socket.connect(port, host);
      } catch {
        finish(false);
      }
    });
  }

  /**
   * Liveness probe: verifies that the Node.js API process is responsive.
   */
  checkLiveness(): LivenessResponse {
    return {
      status: "alive",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      pid: process.pid,
    };
  }

  /**
   * Readiness probe: verifies operational dependencies (PostgreSQL and Redis) with real connectivity probes.
   * Safe against credential leakage: never prints connection strings, passwords, or raw stacks in health messages.
   */
  async checkReadiness(overrides?: {
    dbProbe?: () => Promise<boolean>;
    redisProbe?: () => Promise<boolean>;
  }): Promise<ReadinessResponse> {
    const startDb = Date.now();
    let dbStatus: "up" | "down" = "down";
    let dbMessage = "PostgreSQL instance offline (Port 5432 unreachable or container down)";

    try {
      if (overrides?.dbProbe) {
        const isUp = await overrides.dbProbe();
        if (isUp) {
          dbStatus = "up";
          dbMessage = "PostgreSQL connection active";
        }
      } else if (this.prisma) {
        // Active database probe: execute SELECT 1 query
        await this.prisma.$queryRaw`SELECT 1`;
        dbStatus = "up";
        dbMessage = "PostgreSQL connection active";
        this.prisma.isConnected = true;
      }
    } catch (err) {
      dbStatus = "down";
      dbMessage = "PostgreSQL instance offline or connection refused";
      if (this.prisma) {
        this.prisma.isConnected = false;
      }
      this.logger.debug(`PostgreSQL probe failed safely: ${(err as Error).message}`);
    }
    const dbLatency = Date.now() - startDb;

    const startRedis = Date.now();
    let redisStatus: "up" | "down" = "down";
    let redisMessage = "Redis instance offline (Port 6379 unreachable or container down)";

    try {
      if (overrides?.redisProbe) {
        const isUp = await overrides.redisProbe();
        if (isUp) {
          redisStatus = "up";
          redisMessage = "Redis instance connection active";
        }
      } else {
        const redisHost = process.env.REDIS_HOST || "127.0.0.1";
        const redisPort = parseInt(process.env.REDIS_PORT || "6379", 10);
        const isUp = await this.probeTcp(redisHost, redisPort, 1500);
        if (isUp) {
          redisStatus = "up";
          redisMessage = "Redis instance connection active";
        }
      }
    } catch {
      redisStatus = "down";
      redisMessage = "Redis connection probe failed";
    }
    const redisLatency = Date.now() - startRedis;

    const databaseCheck: DependencyStatus = {
      status: dbStatus,
      message: dbMessage,
      latencyMs: dbLatency,
    };

    const redisCheck: DependencyStatus = {
      status: redisStatus,
      message: redisMessage,
      latencyMs: redisLatency,
    };

    // Strict readiness evaluation:
    // Both dependencies must be "up" for status to be "ready".
    // If DB is up but Redis is down: "degraded" (partial dependency failure).
    // If DB is down: "unready".
    let status: "ready" | "degraded" | "unready";
    let ready: boolean;

    if (dbStatus === "up" && redisStatus === "up") {
      status = "ready";
      ready = true;
    } else if (dbStatus === "up" && redisStatus === "down") {
      status = "degraded";
      ready = false;
    } else {
      status = "unready";
      ready = false;
    }

    return {
      status,
      ready,
      timestamp: new Date().toISOString(),
      checks: {
        database: databaseCheck,
        redis: redisCheck,
      },
    };
  }

  /**
   * Comprehensive health status probe (backward compatible with Phase 1).
   */
  async checkHealth(): Promise<HealthStatusResponse> {
    const readiness = await this.checkReadiness();

    const dbServiceStatus =
      readiness.checks.database.status === "up" ? "connected" : "disconnected";
    const redisServiceStatus =
      readiness.checks.redis.status === "up" ? "connected" : "disconnected";

    const overallStatus: "ok" | "degraded" | "error" =
      readiness.status === "ready" ? "ok" : readiness.status === "degraded" ? "degraded" : "error";

    return {
      status: overallStatus,
      version: "0.1.0",
      environment: process.env.NODE_ENV || "development",
      uptime: process.uptime(),
      timestamp: readiness.timestamp,
      services: {
        database: dbServiceStatus,
        redis: redisServiceStatus,
      },
      details: {
        databaseStatusMessage: readiness.checks.database.message,
        redisStatusMessage: readiness.checks.redis.message,
      },
    };
  }
}
