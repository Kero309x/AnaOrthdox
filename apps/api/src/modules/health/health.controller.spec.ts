import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";
import { HealthController } from "./health.controller";
import { HealthService } from "./health.service";
import { PrismaService } from "../prisma/prisma.service";
import { Response } from "express";

describe("HealthController Unit Suite (Mocked Dependencies)", () => {
  let controller: HealthController;
  let service: HealthService;

  beforeEach(() => {
    const mockPrisma = { isConnected: false } as PrismaService;
    service = new HealthService(mockPrisma);
    controller = new HealthController(service);
  });

  it("should return HTTP 200 with alive status for GET /health/live", () => {
    const result = controller.getLive();
    assert.strictEqual(result.status, "alive");
    assert.strictEqual(typeof result.uptime, "number");
    assert.strictEqual(typeof result.pid, "number");
  });

  it("should return HTTP 200 for GET /health/ready when all dependencies are ready", async () => {
    // Override checkReadiness for fully ready state
    service.checkReadiness = async () => ({
      status: "ready",
      ready: true,
      timestamp: new Date().toISOString(),
      checks: {
        database: { status: "up", message: "PostgreSQL active" },
        redis: { status: "up", message: "Redis active" },
      },
    });

    let capturedStatus: number | null = null;
    const mockRes = {
      status: (code: number) => {
        capturedStatus = code;
        return mockRes;
      },
    } as unknown as Response;

    const result = await controller.getReady(mockRes);
    assert.strictEqual(result.ready, true);
    assert.strictEqual(result.status, "ready");
    assert.strictEqual(capturedStatus, null); // 200 OK is default, res.status(503) not called
  });

  it("should return HTTP 503 for GET /health/ready on partial dependency failure (degraded)", async () => {
    // Override checkReadiness for degraded state (DB up, Redis down)
    service.checkReadiness = async () => ({
      status: "degraded",
      ready: false,
      timestamp: new Date().toISOString(),
      checks: {
        database: { status: "up", message: "PostgreSQL active" },
        redis: { status: "down", message: "Redis offline" },
      },
    });

    let capturedStatus: number | null = null;
    const mockRes = {
      status: (code: number) => {
        capturedStatus = code;
        return mockRes;
      },
    } as unknown as Response;

    const result = await controller.getReady(mockRes);
    assert.strictEqual(result.ready, false);
    assert.strictEqual(result.status, "degraded");
    assert.strictEqual(capturedStatus, 503); // Critical: Must set 503 Service Unavailable
  });

  it("should return HTTP 503 for GET /health/ready when database is down (unready)", async () => {
    // Override checkReadiness for unready state
    service.checkReadiness = async () => ({
      status: "unready",
      ready: false,
      timestamp: new Date().toISOString(),
      checks: {
        database: { status: "down", message: "PostgreSQL offline" },
        redis: { status: "down", message: "Redis offline" },
      },
    });

    let capturedStatus: number | null = null;
    const mockRes = {
      status: (code: number) => {
        capturedStatus = code;
        return mockRes;
      },
    } as unknown as Response;

    const result = await controller.getReady(mockRes);
    assert.strictEqual(result.ready, false);
    assert.strictEqual(result.status, "unready");
    assert.strictEqual(capturedStatus, 503);
  });
});
