import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";

@Injectable()
export class MfaGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const hasMfaHeader = req.headers["x-mfa-verified"] === "true";
    if (!hasMfaHeader) {
      throw new ForbiddenException("MFA verification required");
    }
    return true;
  }
}
