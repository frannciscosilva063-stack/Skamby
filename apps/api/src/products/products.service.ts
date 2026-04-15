import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { AuditService } from "../audit/audit.service.js";
import type { CreateProductDto, ProductQueryDto } from "./products.dto.js";

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService
  ) {}

  async list(query: ProductQueryDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const skip = (page - 1) * pageSize;
    const where = {
      status: "ACTIVE" as const,
      category: query.category,
      condition: query.condition,
      state: query.state,
      city: query.city,
      priceCents: {
        gte: query.minPrice,
        lte: query.maxPrice
      }
    };

    const orderBy =
      query.sort === "price_asc"
        ? { priceCents: "asc" as const }
        : query.sort === "price_desc"
          ? { priceCents: "desc" as const }
          : { createdAt: "desc" as const };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        include: { images: true, owner: { include: { profilePublic: true } } },
        orderBy,
        skip,
        take: pageSize
      }),
      this.prisma.product.count({ where })
    ]);

    return { items, total, page, pageSize };
  }

  async getById(id: string) {
    const item = await this.prisma.product.findUnique({
      where: { id },
      include: { images: true, owner: { include: { profilePublic: true } } }
    });
    if (!item) throw new NotFoundException("Product not found");
    return item;
  }

  async create(userId: string, dto: CreateProductDto) {
    const quota = await this.getCurrentQuota(userId);
    if (quota.usedPosts >= quota.allowedPosts) {
      throw new ForbiddenException("Posting quota exceeded");
    }

    const product = await this.prisma.product.create({
      data: {
        ownerId: userId,
        title: dto.title,
        description: dto.description,
        priceCents: dto.priceCents,
        condition: dto.condition,
        category: dto.category,
        state: dto.state.toUpperCase(),
        city: dto.city,
        images: {
          create: dto.images.map((url, index) => ({ url, publicId: `manual-${index}`, position: index }))
        }
      },
      include: { images: true }
    });

    await this.prisma.postingQuota.update({
      where: { id: quota.id },
      data: { usedPosts: quota.usedPosts + 1 }
    });

    await this.audit.log({ userId, action: "PRODUCT_CREATE", targetType: "Product", targetId: product.id });
    return product;
  }

  async update(userId: string, role: "USER" | "ADMIN", id: string, dto: Partial<CreateProductDto>) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Product not found");
    if (role !== "ADMIN" && existing.ownerId !== userId) throw new ForbiddenException("Forbidden");

    const { images, ...scalarUpdates } = dto;
    const product = await this.prisma.product.update({ where: { id }, data: scalarUpdates });

    if (images) {
      await this.prisma.productImage.deleteMany({ where: { productId: id } });
      if (images.length) {
        await this.prisma.productImage.createMany({
          data: images.map((url, index) => ({ productId: id, url, publicId: `manual-${index}`, position: index }))
        });
      }
    }

    await this.audit.log({ userId, action: "PRODUCT_UPDATE", targetType: "Product", targetId: id });
    return this.getById(product.id);
  }

  async remove(userId: string, role: "USER" | "ADMIN", id: string) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Product not found");
    if (role !== "ADMIN" && existing.ownerId !== userId) throw new ForbiddenException("Forbidden");

    await this.prisma.product.update({ where: { id }, data: { status: "ARCHIVED" } });
    await this.audit.log({ userId, action: "PRODUCT_ARCHIVE", targetType: "Product", targetId: id });
    return { ok: true };
  }

  private async getCurrentQuota(userId: string) {
    const quota = await this.prisma.postingQuota.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } });
    if (quota) return quota;

    return this.prisma.postingQuota.create({
      data: {
        userId,
        allowedPosts: 3,
        usedPosts: 0,
        source: "FREE"
      }
    });
  }
}
