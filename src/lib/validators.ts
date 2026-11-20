import { z } from "zod";

export const shopifyAuthSchema = z.object({
  shop: z.string().regex(/^[a-z0-9-]+\.myshopify\.com$/, "Invalid shop domain"),
});

export const shopifyPublishSchema = z.object({
  shopDomain: z.string().regex(/^[a-z0-9-]+\.myshopify\.com$/, "Invalid shop domain"),
  title: z.string().min(3),
  description: z.string().min(20),
  tags: z.array(z.string()).max(20),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(320).optional(),
  aiPrompt: z.string().optional(),
});

export const trendRequestSchema = z.object({
  niche: z.string().min(2).optional(),
  source: z.enum(["tiktok", "amazon", "google", "etsy", "reddit"]).optional(),
});
