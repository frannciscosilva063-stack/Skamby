import { Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard.js";
import { CurrentUser } from "../common/decorators/current-user.decorator.js";
import { FavoritesService } from "./favorites.service.js";

@UseGuards(JwtAuthGuard)
@Controller("favorites")
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  list(@CurrentUser() user: { sub: string }) {
    return this.favoritesService.list(user.sub);
  }

  @Post(":productId")
  add(@CurrentUser() user: { sub: string }, @Param("productId") productId: string) {
    return this.favoritesService.add(user.sub, productId);
  }

  @Delete(":productId")
  remove(@CurrentUser() user: { sub: string }, @Param("productId") productId: string) {
    return this.favoritesService.remove(user.sub, productId);
  }
}
