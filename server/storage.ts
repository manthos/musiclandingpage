import { tracks, type Track, type InsertTrack } from "@shared/schema";

export interface IStorage {
  createTrack(track: InsertTrack): Promise<Track>;
  getTrack(id: number): Promise<Track | undefined>;
  updateTrack(id: number, track: Partial<InsertTrack>): Promise<Track | undefined>;
}

export class MemStorage implements IStorage {
  private tracks: Map<number, Track>;
  private currentId: number;

  constructor() {
    this.tracks = new Map();
    this.currentId = 1;
  }

  async createTrack(insertTrack: InsertTrack): Promise<Track> {
    const id = this.currentId++;
    const track = { ...insertTrack, id };
    this.tracks.set(id, track);
    return track;
  }

  async getTrack(id: number): Promise<Track | undefined> {
    return this.tracks.get(id);
  }

  async updateTrack(id: number, track: Partial<InsertTrack>): Promise<Track | undefined> {
    const existing = this.tracks.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...track };
    this.tracks.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
