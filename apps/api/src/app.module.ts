import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { AppController } from "./app.controller.js";
import { PrismaModule } from "./prisma/prisma.module.js";
import { AuthModule } from "./auth/auth.module.js";
import { ProductsModule } from "./products/products.module.js";
import { FavoritesModule } from "./favorites/favorites.module.js";
import { PlansModule } from "./plans/plans.module.js";
import { PaymentsModule } from "./payments/payments.module.js";
import { ProfileModule } from "./profile/profile.module.js";
import { ChatModule } from "./chat/chat.module.js";
import { UploadsModule } from "./uploads/uploads.module.js";
import { AuditModule } from "./audit/audit.module.js";
import { AdminModule } from "./admin/admin.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      { ttl: 60_000, limit: 100 }
    ]),
    PrismaModule,
    AuthModule,
    ProductsModule,
    FavoritesModule,
    PlansModule,
    PaymentsModule,
    ProfileModule,
    ChatModule,
    UploadsModule,
    AuditModule,
    AdminModule
  ],
  controllers: [AppController]
})
export class AppModule {}

