import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { HealthModule } from "./health.module";
import { TransformInterceptor } from "../../common/interceptors/transform.interceptor";
import { AllExceptionsFilter } from "../../common/filters/http-exception.filter";

describe("Health HTTP-Level Integration Suite (Real Network & Pipeline)", () => {
  let app: INestApplication;
  let baseUrl: string;

  before(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [HealthModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix("api/v1");
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalInterceptors(new TransformInterceptor());

    await app.listen(0);
    const server = app.getHttpServer();
    const address = server.address();
    const port = typeof address === "object" && address ? address.port : 0;
    baseUrl = `http://localhost:${port}/api/v1`;
  });

  after(async () => {
    if (app) {
      await app.close();
    }
  });

  it("GET /api/v1/health/live should return HTTP 200 with success: true and alive payload", async () => {
    const response = await fetch(`${baseUrl}/health/live`);
    assert.strictEqual(response.status, 200);

    const json = (await response.json()) as any;
    assert.strictEqual(json.success, true);
    assert.ok(json.data);
    assert.strictEqual(json.data.status, "alive");
    assert.strictEqual(typeof json.data.pid, "number");
    assert.strictEqual(typeof json.data.uptime, "number");
  });

  it("GET /api/v1/health/ready should return HTTP 503 with success: false (no contradiction) when dependencies are offline", async () => {
    const response = await fetch(`${baseUrl}/health/ready`);
    // On the current Windows host, PostgreSQL and Redis containers are offline.
    // The readiness endpoint must truthfully return 503 Service Unavailable.
    assert.strictEqual(response.status, 503);

    const json = (await response.json()) as any;
    // Core verification: HTTP 503 must NEVER have success: true in the envelope!
    assert.strictEqual(json.success, false);
    assert.ok(json.error);
    assert.strictEqual(json.error.code, "ANA-HTTP-503");
    assert.strictEqual(json.data.ready, false);
    assert.strictEqual(json.data.status, "unready");
    assert.strictEqual(json.data.checks.database.status, "down");
    assert.strictEqual(json.data.checks.redis.status, "down");
  });
});
