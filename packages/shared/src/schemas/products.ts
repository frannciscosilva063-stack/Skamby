import { z } from "zod";

export const productConditionSchema = z.enum(["NOVO", "BOM", "USADO", "PRECISA_REPAROS"]);

export const productCreateSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  priceCents: z.number().int().nonnegative(),
  condition: productConditionSchema,
  category: z.string().min(2).max(60),
  state: z.string().min(2).max(2),
  city: z.string().min(2).max(80),
  images: z.array(z.string().url()).max(5)
});

export const productQuerySchema = z.object({
  category: z.string().optional(),
  condition: productConditionSchema.optional(),
  state: z.string().length(2).optional(),
  city: z.string().optional(),
  minPrice: z.coerce.number().int().nonnegative().optional(),
  maxPrice: z.coerce.number().int().nonnegative().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.enum(["recent", "price_asc", "price_desc"]).default("recent")
});

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
