import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../common/decorators/current-user.decorator.js";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard.js";
import { ProductsService } from "./products.service.js";
import { CreateProductDto, ProductQueryDto } from "./products.dto.js";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  list(@Query() query: ProductQueryDto) {
    return this.productsService.list(query);
  }

  @Get(":id")
  getById(@Param("id") id: string) {
    return this.productsService.getById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@CurrentUser() user: { sub: string }, @Body() dto: CreateProductDto) {
    return this.productsService.create(user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  update(@CurrentUser() user: { sub: string; role: "USER" | "ADMIN" }, @Param("id") id: string, @Body() dto: Partial<CreateProductDto>) {
    return this.productsService.update(user.sub, user.role, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@CurrentUser() user: { sub: string; role: "USER" | "ADMIN" }, @Param("id") id: string) {
    return this.productsService.remove(user.sub, user.role, id);
  }
}
