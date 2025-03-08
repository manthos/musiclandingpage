import { z } from "zod";

const youtubeVideoSchema = z.object({
  items: z.array(z.object({
    snippet: z.object({
      title: z.string(),
      channelTitle: z.string(),
      thumbnails: z.object({
        high: z.object({
          url: z.string()
        })
      })
    })
  }))
});

export async function getYoutubeVideoInfo(url: string) {
  const id = extractYoutubeId(url);
  if (!id) throw new Error("Invalid YouTube URL");

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch YouTube video");
  }

  const data = youtubeVideoSchema.parse(await res.json());
  const video = data.items[0];
  
  return {
    title: video.snippet.title,
    artist: video.snippet.channelTitle,
    artwork: video.snippet.thumbnails.high.url
  };
}

function extractYoutubeId(url: string) {
  const match = url.match(/(?:v=|\/)([\w-]{11})(?:\?|&|\/|$)/);
  return match?.[1];
}
