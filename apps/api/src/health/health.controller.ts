import { Controller, Get } from "@nestjs/common";

@Controller("health")
export class HealthController {
  @Get()
  status(): { status: "ok"; service: string; environment: string } {
    return {
      status: "ok",
      service: "citizenx-api",
      environment: process.env["NODE_ENV"] ?? "development"
    };
  }
}

