import { z } from "zod";

const tidalSearchSchema = z.object({
  items: z.array(z.object({
    title: z.string(),
    artist: z.object({
      name: z.string()
    }),
    id: z.string()
  }))
});

export async function searchTidalTrack(title: string, artist: string) {
  try {
    const params = new URLSearchParams({
      query: `${title} ${artist}`,
      limit: "1",
      types: "tracks"
    });

    const res = await fetch(`https://api.tidal.com/v1/search?${params}`, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_TIDAL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) return null;

    const data = tidalSearchSchema.parse(await res.json());
    if (data.items.length === 0) return null;

    const track = data.items[0];
    return {
      platform: 'tidal' as const,
      url: `https://listen.tidal.com/track/${track.id}`
    };
  } catch (error) {
    console.error('Failed to search Tidal:', error);
    return null;
  }
}
