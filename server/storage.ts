import { tracks, type Track, type InsertTrack } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createTrack(track: InsertTrack): Promise<Track>;
  getTrack(id: number): Promise<Track | undefined>;
  updateTrack(id: number, track: Partial<InsertTrack>): Promise<Track | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createTrack(insertTrack: InsertTrack): Promise<Track> {
    const [track] = await db
      .insert(tracks)
      .values(insertTrack)
      .returning();
    return track;
  }

  async getTrack(id: number): Promise<Track | undefined> {
    const [track] = await db.select().from(tracks).where(eq(tracks.id, id));
    return track;
  }

  async updateTrack(id: number, track: Partial<InsertTrack>): Promise<Track | undefined> {
    const [updated] = await db
      .update(tracks)
      .set(track)
      .where(eq(tracks.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();