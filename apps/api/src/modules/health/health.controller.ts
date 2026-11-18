import { Controller, Get, Res, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { ApiTags, ApiOperation, ApiResponse as SwaggerResponse } from "@nestjs/swagger";
import { HealthService } from "./health.service";
import {
  HealthStatusResponse,
  LivenessResponse,
  ReadinessResponse,
} from "@ana-orthodox/shared-types";

@ApiTags("Health")
@Controller("health")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: "Platform health check and subsystem status" })
  @SwaggerResponse({ status: 200, description: "Health status returned successfully" })
  async getHealth(): Promise<HealthStatusResponse> {
    return this.healthService.checkHealth();
  }

  @Get("live")
  @ApiOperation({ summary: "Process liveness probe" })
  @SwaggerResponse({ status: 200, description: "Process is alive and healthy" })
  getLive(): LivenessResponse {
    return this.healthService.checkLiveness();
  }

  @Get("ready")
  @ApiOperation({ summary: "Dependency readiness probe" })
  @SwaggerResponse({ status: 200, description: "All required dependencies ready" })
  @SwaggerResponse({ status: 503, description: "One or more dependencies offline or degraded" })
  async getReady(@Res({ passthrough: true }) res: Response): Promise<ReadinessResponse> {
    const readiness = await this.healthService.checkReadiness();
    if (!readiness.ready) {
      res.status(HttpStatus.SERVICE_UNAVAILABLE);
    }
    return readiness;
  }
}
