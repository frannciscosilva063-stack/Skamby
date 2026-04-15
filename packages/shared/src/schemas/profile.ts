import { z } from "zod";

export const profilePublicSchema = z.object({
  displayName: z.string().min(2).max(80),
  city: z.string().max(80).optional(),
  state: z.string().length(2).optional(),
  bio: z.string().max(280).optional()
});

export const profilePrivateSchema = z.object({
  phone: z.string().min(10).max(20).optional(),
  cpfMasked: z.string().max(20).optional(),
  consented: z.boolean().optional()
});

export const profileUpdateSchema = z.object({
  public: profilePublicSchema,
  private: profilePrivateSchema
});
