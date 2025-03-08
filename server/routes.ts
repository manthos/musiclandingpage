import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertTrackSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  app.post("/api/tracks", async (req, res) => {
    try {
      const track = insertTrackSchema.parse(req.body);
      const created = await storage.createTrack(track);
      res.json(created);
    } catch (err) {
      res.status(400).json({ message: "Invalid track data" });
    }
  });

  app.get("/api/tracks/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const track = await storage.getTrack(id);
    
    if (!track) {
      return res.status(404).json({ message: "Track not found" });
    }
    
    res.json(track);
  });

  app.patch("/api/tracks/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const update = insertTrackSchema.partial().parse(req.body);
    
    const track = await storage.updateTrack(id, update);
    if (!track) {
      return res.status(404).json({ message: "Track not found" });
    }
    
    res.json(track);
  });

  return createServer(app);
}
