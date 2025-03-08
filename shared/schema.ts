import { pgTable, text, serial, varchar, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tracks = pgTable("tracks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  artwork: text("artwork").notNull(),
  spotifyUrl: text("spotify_url"),
  youtubeUrl: text("youtube_url"),
  description: text("description"),
  customLinks: json("custom_links").$type<{
    label: string;
    url: string;
  }[]>().default([]),
  socialLinks: json("social_links").$type<{
    platform: string;
    url: string;
  }[]>().default([]),
  analytics: json("analytics").$type<{
    gaId: string;
    fbPixelId: string;
  }>().default({}),
});

export const insertTrackSchema = createInsertSchema(tracks).omit({ id: true });

export const platformSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

export const analyticsSchema = z.object({
  gaId: z.string().optional(),
  fbPixelId: z.string().optional(),
});

export type InsertTrack = z.infer<typeof insertTrackSchema>;
export type Track = typeof tracks.$inferSelect;
