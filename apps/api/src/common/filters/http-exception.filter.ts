import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";
import { ApiErrorResponse } from "@ana-orthodox/shared-types";
import { randomUUID } from "crypto";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const traceId = randomUUID();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = "Internal server error";
    let code = "ANA-SRV-6001";
    let details: any = undefined;

    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      if (typeof res === "string") {
        message = res;
      } else if (typeof res === "object" && res !== null) {
        const errorObj = res as Record<string, any>;
        message = errorObj["message"] || message;
        details = Array.isArray(errorObj["message"]) ? errorObj["message"] : undefined;
      }
      code = `ANA-HTTP-${status}`;
    } else if (exception instanceof Error) {
      this.logger.error(`[${traceId}] Uncaught Exception: ${exception.message}`, exception.stack);
    }

    const errorPayload: ApiErrorResponse = {
      success: false,
      error: {
        code,
        message: Array.isArray(message) ? message[0] : message,
        details: Array.isArray(details)
          ? details.map((d: any) => ({ issue: String(d) }))
          : undefined,
        timestamp: new Date().toISOString(),
        path: request.url,
        traceId,
      },
    };

    response.status(status).json(errorPayload);
  }
}
