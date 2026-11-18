import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { CalendarModule } from "./calendar.module";
import { TransformInterceptor } from "../../common/interceptors/transform.interceptor";
import { AllExceptionsFilter } from "../../common/filters/http-exception.filter";

describe("Calendar HTTP Integration Suite (Real Network & Pipeline)", () => {
  let app: INestApplication;
  let baseUrl: string;

  before(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [CalendarModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix("api/v1");
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );
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

  it("GET /api/v1/calendar/coptic/from-gregorian should convert valid date and return standard envelope", async () => {
    const res = await fetch(`${baseUrl}/calendar/coptic/from-gregorian?date=2026-09-11`);
    assert.strictEqual(res.status, 200);

    const json = (await res.json()) as any;
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.coptic.year, 1743);
    assert.strictEqual(json.data.coptic.month, 1);
    assert.strictEqual(json.data.coptic.day, 1);
    assert.strictEqual(json.data.coptic.monthCode, "thout");
    assert.strictEqual(json.data.coptic.monthNameAr, "توت");
    assert.strictEqual(json.data.coptic.isLeapYear, true);
    assert.strictEqual(json.data.formatted.ar, "١ توت ١٧٤٣ ش");
  });

  it("GET /api/v1/calendar/coptic/from-gregorian should return HTTP 400 for malformed date", async () => {
    const res = await fetch(`${baseUrl}/calendar/coptic/from-gregorian?date=not-a-date`);
    assert.strictEqual(res.status, 400);

    const json = (await res.json()) as any;
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.error.code, "ANA-HTTP-400");
  });

  it("GET /api/v1/calendar/coptic/from-gregorian should return HTTP 400 when date parameter is missing", async () => {
    const res = await fetch(`${baseUrl}/calendar/coptic/from-gregorian`);
    assert.strictEqual(res.status, 400);

    const json = (await res.json()) as any;
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.error.code, "ANA-HTTP-400");
  });

  it("GET /api/v1/calendar/coptic/to-gregorian should convert valid Coptic date to Gregorian", async () => {
    const res = await fetch(`${baseUrl}/calendar/coptic/to-gregorian?year=1743&month=4&day=29`);
    assert.strictEqual(res.status, 200);

    const json = (await res.json()) as any;
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.gregorian.iso, "2027-01-07");
    assert.strictEqual(json.data.coptic.monthCode, "koiak");
  });

  it("GET /api/v1/calendar/coptic/to-gregorian should return HTTP 400 for invalid Nasie day in common year", async () => {
    const res = await fetch(`${baseUrl}/calendar/coptic/to-gregorian?year=1744&month=13&day=6`);
    assert.strictEqual(res.status, 400);

    const json = (await res.json()) as any;
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.error.code, "ANA-HTTP-400");
  });

  it("GET /api/v1/calendar/coptic/to-gregorian should return HTTP 400 for day > 30 in regular month", async () => {
    const res = await fetch(`${baseUrl}/calendar/coptic/to-gregorian?year=1743&month=1&day=31`);
    assert.strictEqual(res.status, 400);

    const json = (await res.json()) as any;
    assert.strictEqual(json.success, false);
    assert.strictEqual(json.error.code, "ANA-HTTP-400");
  });
});
