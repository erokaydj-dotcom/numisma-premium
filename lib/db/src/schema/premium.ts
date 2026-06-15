import { pgTable, text, integer, boolean, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const premiumCodesTable = pgTable("premium_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").notNull().unique(),
  durationDays: integer("duration_days").notNull().default(30),
  isUsed: boolean("is_used").notNull().default(false),
  usedBy: text("used_by"),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPremiumCodeSchema = createInsertSchema(premiumCodesTable).omit({
  id: true,
  createdAt: true,
});
export const selectPremiumCodeSchema = createSelectSchema(premiumCodesTable);
export type PremiumCode = typeof premiumCodesTable.$inferSelect;
export type InsertPremiumCode = typeof premiumCodesTable.$inferInsert;

export const userPremiumTable = pgTable("user_premium", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().unique(),
  isPremium: boolean("is_premium").notNull().default(true),
  expiresAt: timestamp("expires_at").notNull(),
  redeemedCode: text("redeemed_code"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserPremiumSchema = createInsertSchema(userPremiumTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type UserPremium = typeof userPremiumTable.$inferSelect;
