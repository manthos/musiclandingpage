import { z } from "zod";

const spotifyTrackSchema = z.object({
  name: z.string(),
  artists: z.array(z.object({ name: z.string() })),
  album: z.object({
    images: z.array(z.object({ url: z.string() }))
  })
});

export async function getSpotifyTrackInfo(url: string) {
  const id = extractSpotifyId(url);
  if (!id) throw new Error("Invalid Spotify URL");

  const res = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_SPOTIFY_TOKEN}`
    }
  });

  if (!res.ok) {
    throw new Error("Failed to fetch Spotify track");
  }

  const data = spotifyTrackSchema.parse(await res.json());
  
  return {
    title: data.name,
    artist: data.artists[0].name,
    artwork: data.album.images[0].url
  };
}

function extractSpotifyId(url: string) {
  const match = url.match(/track\/([a-zA-Z0-9]+)/);
  return match?.[1];
}
