import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Response } from "express";

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const res = http.getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        const statusCode = res?.statusCode ?? 200;
        const isSuccess = statusCode >= 200 && statusCode < 400;

        // When a controller sets a non-success HTTP status (e.g. 503 for degraded/unready health probes),
        // ensure the response envelope matches the HTTP status to prevent contradictions.
        if (!isSuccess) {
          return {
            success: false,
            error: {
              code: `ANA-HTTP-${statusCode}`,
              message:
                data?.status === "degraded"
                  ? "Service dependencies degraded"
                  : data?.status === "unready"
                    ? "Service dependencies unavailable"
                    : "Service unavailable",
              details: data?.checks
                ? Object.entries(data.checks)
                    .filter(([_, check]: [string, any]) => check.status === "down")
                    .map(([name, check]: [string, any]) => ({
                      field: name,
                      issue: `${name}: ${check.message}`,
                    }))
                : undefined,
              timestamp: new Date().toISOString(),
            },
            data,
            meta: {
              timestamp: new Date().toISOString(),
              version: "v1",
            },
          };
        }

        return {
          success: true,
          data,
          meta: {
            timestamp: new Date().toISOString(),
            version: "v1",
          },
        };
      })
    );
  }
}
