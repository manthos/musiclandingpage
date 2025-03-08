import { z } from "zod";

// Define supported platforms and their base URLs
export const platforms = {
  spotify: {
    name: "Spotify",
    searchUrl: "https://api.spotify.com/v1/search",
    icon: "SiSpotify",
  },
  youtube: {
    name: "YouTube",
    searchUrl: "https://www.googleapis.com/youtube/v3/search",
    icon: "SiYoutube",
  },
  youtubeMusic: {
    name: "YouTube Music",
    searchUrl: "https://music.youtube.com/search",
    icon: "SiYoutube",
  },
  appleMusic: {
    name: "Apple Music",
    searchUrl: "https://api.music.apple.com/v1/catalog/us/search",
    icon: "SiAppleMusic",
  },
  soundcloud: {
    name: "SoundCloud",
    searchUrl: "https://api.soundcloud.com/tracks",
    icon: "SiSoundcloud",
  },
  amazonMusic: {
    name: "Amazon Music",
    searchUrl: "https://music.amazon.com/search",
    icon: "SiAmazon",
  }
};

export type Platform = keyof typeof platforms;

export interface StreamingLink {
  platform: Platform;
  url: string;
}

// Search for a track across multiple platforms
export async function searchAcrossPlatforms(title: string, artist: string): Promise<StreamingLink[]> {
  const searchQuery = `${title} ${artist}`.trim();
  const links: StreamingLink[] = [];

  // Add YouTube Music link
  const youtubeMusicUrl = `https://music.youtube.com/search?q=${encodeURIComponent(searchQuery)}`;
  links.push({
    platform: 'youtubeMusic',
    url: youtubeMusicUrl
  });

  // Add Apple Music link
  const appleMusicUrl = `https://music.apple.com/us/search?term=${encodeURIComponent(searchQuery)}`;
  links.push({
    platform: 'appleMusic',
    url: appleMusicUrl
  });

  // Add SoundCloud link
  const soundcloudUrl = `https://soundcloud.com/search?q=${encodeURIComponent(searchQuery)}`;
  links.push({
    platform: 'soundcloud',
    url: soundcloudUrl
  });

  // Add Amazon Music link
  const amazonMusicUrl = `https://music.amazon.com/search/${encodeURIComponent(searchQuery)}`;
  links.push({
    platform: 'amazonMusic',
    url: amazonMusicUrl
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