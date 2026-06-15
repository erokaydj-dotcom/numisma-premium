import { pgTable, text, integer, real, jsonb, timestamp, uuid, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const coinsTable = pgTable("coins", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  coinName: text("coin_name").notNull(),
  culture: text("culture"),
  ruler: text("ruler"),
  dynasty: text("dynasty"),
  period: text("period"),
  yearMinted: text("year_minted"),
  mint: text("mint"),
  denomination: text("denomination"),
  material: text("material"),
  diameter: text("diameter"),
  weight: text("weight"),
  obverse: text("obverse"),
  reverse: text("reverse"),
  rarity: text("rarity"),
  grade: text("grade"),
  confidenceScore: integer("confidence_score"),
  description: text("description"),
  historicalContext: text("historical_context"),
  estimatedValueMin: real("estimated_value_min"),
  estimatedValueMax: real("estimated_value_max"),
  valueCurrency: text("value_currency").default("USD"),
  authenticityScore: integer("authenticity_score"),
  verdict: text("verdict"),
  imageUrl: text("image_url"),
  acquisitionPrice: real("acquisition_price"),
  notes: text("notes"),
  fullAnalysis: jsonb("full_analysis"),
  addedAt: timestamp("added_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCoinSchema = createInsertSchema(coinsTable).omit({
  id: true,
  addedAt: true,
  updatedAt: true,
});

export const selectCoinSchema = createSelectSchema(coinsTable);

export type InsertCoin = z.infer<typeof insertCoinSchema>;
export type Coin = typeof coinsTable.$inferSelect;

export const chatMessagesTable = pgTable("chat_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  coinId: uuid("coin_id").references(() => coinsTable.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessagesTable.$inferSelect;
export type InsertChatMessage = typeof chatMessagesTable.$inferInsert;

export const scanHistoryTable = pgTable("scan_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  coinId: uuid("coin_id").references(() => coinsTable.id, { onDelete: "set null" }),
  identified: boolean("identified").default(false),
  confidenceScore: integer("confidence_score"),
  scannedAt: timestamp("scanned_at").defaultNow().notNull(),
});
