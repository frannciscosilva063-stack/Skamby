import { ArrayMaxSize, IsArray, IsIn, IsInt, IsOptional, IsString, Length, Min } from "class-validator";

export class CreateProductDto {
  @IsString()
  @Length(3, 100)
  title!: string;

  @IsString()
  @Length(10, 1000)
  description!: string;

  @IsInt()
  @Min(0)
  priceCents!: number;

  @IsIn(["NOVO", "BOM", "USADO", "PRECISA_REPAROS"])
  condition!: "NOVO" | "BOM" | "USADO" | "PRECISA_REPAROS";

  @IsString()
  @Length(2, 60)
  category!: string;

  @IsString()
  @Length(2, 2)
  state!: string;

  @IsString()
  @Length(2, 80)
  city!: string;

  @IsArray()
  @ArrayMaxSize(5)
  images!: string[];
}

export class ProductQueryDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsIn(["NOVO", "BOM", "USADO", "PRECISA_REPAROS"])
  condition?: "NOVO" | "BOM" | "USADO" | "PRECISA_REPAROS";

  @IsOptional()
  @IsInt()
  minPrice?: number;

  @IsOptional()
  @IsInt()
  maxPrice?: number;

  @IsOptional()
  @IsInt()
  page?: number;

  @IsOptional()
  @IsInt()
  pageSize?: number;

  @IsOptional()
  @IsIn(["recent", "price_asc", "price_desc"])
  sort?: "recent" | "price_asc" | "price_desc";
}


