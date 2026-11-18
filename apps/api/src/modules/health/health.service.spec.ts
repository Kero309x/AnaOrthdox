import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";
import { HealthService } from "./health.service";
import { PrismaService } from "../prisma/prisma.service";

describe("HealthService Suite", () => {
  let service: HealthService;
  let mockPrisma: Partial<PrismaService>;

  beforeEach(() => {
    mockPrisma = {
      isConnected: false,
    };
    service = new HealthService(mockPrisma as PrismaService);
  });

  describe("Liveness Probe (GET /health/live)", () => {
    it("should report process as alive with pid and uptime", () => {
      const liveness = service.checkLiveness();
      assert.strictEqual(liveness.status, "alive");
      assert.strictEqual(typeof liveness.uptime, "number");
      assert.ok(liveness.uptime >= 0);
      assert.strictEqual(typeof liveness.pid, "number");
      assert.ok(liveness.pid > 0);
      assert.ok(!isNaN(Date.parse(liveness.timestamp)));
    });
  });

  describe("Readiness Probe & Dependency Matrix (GET /health/ready)", () => {
    it("should report 'ready' when both Database and Redis are available", async () => {
      const readiness = await service.checkReadiness({
        dbProbe: async () => true,
        redisProbe: async () => true,
      });

      assert.strictEqual(readiness.ready, true);
      assert.strictEqual(readiness.status, "ready");
      assert.strictEqual(readiness.checks.database.status, "up");
      assert.strictEqual(readiness.checks.redis.status, "up");
    });

    it("should report 'degraded' (partial failure) when Database is available but Redis is unavailable", async () => {
      const readiness = await service.checkReadiness({
        dbProbe: async () => true,
        redisProbe: async () => false,
      });

      // Crucial: A degraded system must NEVER report ready: true
      assert.strictEqual(readiness.ready, false);
      assert.strictEqual(readiness.status, "degraded");
      assert.strictEqual(readiness.checks.database.status, "up");
      assert.strictEqual(readiness.checks.redis.status, "down");
      assert.ok(readiness.checks.redis.message.includes("offline"));
    });

    it("should report 'unready' when Database is unavailable but Redis is available", async () => {
      const readiness = await service.checkReadiness({
        dbProbe: async () => false,
        redisProbe: async () => true,
      });

      assert.strictEqual(readiness.ready, false);
      assert.strictEqual(readiness.status, "unready");
      assert.strictEqual(readiness.checks.database.status, "down");
      assert.strictEqual(readiness.checks.redis.status, "up");
    });

    it("should report 'unready' when both Database and Redis are unavailable", async () => {
      const readiness = await service.checkReadiness({
        dbProbe: async () => false,
        redisProbe: async () => false,
      });

      assert.strictEqual(readiness.ready, false);
      assert.strictEqual(readiness.status, "unready");
      assert.strictEqual(readiness.checks.database.status, "down");
      assert.strictEqual(readiness.checks.redis.status, "down");
    });

    it("should handle unexpected database exceptions gracefully without crashing", async () => {
      const readiness = await service.checkReadiness({
        dbProbe: async () => {
          throw new Error("Connection timed out at TCP handshake");
        },
        redisProbe: async () => false,
      });

      assert.strictEqual(readiness.ready, false);
      assert.strictEqual(readiness.status, "unready");
      assert.strictEqual(readiness.checks.database.status, "down");
      assert.ok(readiness.checks.database.message.includes("offline"));
    });
  });

  describe("Backward Compatible Health Check (GET /health)", () => {
    it("should report status 'error' when database is disconnected (no misleading mocks)", async () => {
      const health = await service.checkHealth();
      assert.ok(health);
      assert.strictEqual(health.status, "error");
      assert.strictEqual(health.version, "0.1.0");
      assert.strictEqual(health.services.database, "disconnected");
      assert.strictEqual(health.services.redis, "disconnected");
      assert.ok(health.details?.databaseStatusMessage?.includes("offline"));
    });
  });
});
