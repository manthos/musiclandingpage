import { z } from "zod";
import { searchTidalTrack } from "./tidal";
import { searchYoutubeMusicTrack } from "./youtube-music";

// Define supported platforms and their base URLs
export const platforms = {
  spotify: {
    name: "Spotify",
    icon: "SiSpotify",
  },
  youtube: {
    name: "YouTube",
    icon: "SiYoutube",
  },
  youtubeMusic: {
    name: "YouTube Music",
    icon: "SiYoutube",
  },
  appleMusic: {
    name: "Apple Music",
    icon: "SiApplemusic",
  },
  soundcloud: {
    name: "SoundCloud",
    icon: "SiSoundcloud",
  },
  tidal: {
    name: "Tidal",
    icon: "SiTidal",
  },
  amazonMusic: {
    name: "Amazon Music",
    icon: "SiAmazon",
  }
} as const;

export type Platform = keyof typeof platforms;

export interface StreamingLink {
  platform: Platform;
  url: string;
}

// Search for a track across multiple platforms
export async function searchAcrossPlatforms(title: string, artist: string): Promise<StreamingLink[]> {
  const links: StreamingLink[] = [];

  // Try to find the track on Tidal using their API
  const tidalResult = await searchTidalTrack(title, artist);
  if (tidalResult) {
    links.push(tidalResult);
  }

  // Try to find the track on YouTube Music
  const youtubeMusicResult = await searchYoutubeMusicTrack(title, artist);
  if (youtubeMusicResult) {
    links.push(youtubeMusicResult);
  }

  // TODO: Implement actual API verification for these platforms
  // For now, generate search URLs
  const urlEncodedQuery = encodeURIComponent(`${title} ${artist}`);

  // Add Apple Music link (requires Apple Music API integration)
  links.push({
    platform: 'appleMusic',
    url: `https://music.apple.com/us/search?term=${urlEncodedQuery}`
  });

  // Add SoundCloud link (requires SoundCloud API integration)
  links.push({
    platform: 'soundcloud',
    url: `https://soundcloud.com/search?q=${urlEncodedQuery}`
  });

  // Add Amazon Music link (requires Amazon Music API integration)
  links.push({
    platform: 'amazonMusic',
    url: `https://music.amazon.com/search/${urlEncodedQuery}`
  });

  return links;
}

// Helper function to normalize track titles and artist names for better matching
export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ')    // Normalize whitespace
    .trim();
}

// Helper function to calculate similarity between two strings
export function stringSimilarity(str1: string, str2: string): number {
  const s1 = normalizeString(str1);
  const s2 = normalizeString(str2);

  if (s1 === s2) return 1;
  if (s1.includes(s2) || s2.includes(s1)) return 0.9;

  // Simple word overlap calculation
  const words1 = new Set(s1.split(' '));
  const words2 = new Set(s2.split(' '));
  const intersection = [...words1].filter(x => words2.has(x));

  return intersection.length / Math.max(words1.size, words2.size);
}