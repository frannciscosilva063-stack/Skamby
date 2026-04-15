import { IsIn, IsString } from "class-validator";

export class CheckoutDto {
  @IsString()
  @IsIn(["BASIC", "MEDIUM", "PRO"])
  planCode!: "BASIC" | "MEDIUM" | "PRO";
}

export class WebhookDto {
  @IsString()
  eventId!: string;

  @IsString()
  eventType!: string;

  payload!: Record<string, unknown>;
}
