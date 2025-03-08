import { z } from "zod";

const youtubeMusicSearchSchema = z.object({
  items: z.array(z.object({
    id: z.object({
      videoId: z.string()
    }),
    snippet: z.object({
      title: z.string(),
      channelTitle: z.string()
    })
  }))
});

export async function searchYoutubeMusicTrack(title: string, artist: string) {
  try {
    const searchQuery = `${title} ${artist} official audio`;
    const params = new URLSearchParams({
      part: 'snippet',
      q: searchQuery,
      type: 'video',
      videoCategoryId: '10', // Music category
      key: import.meta.env.VITE_YOUTUBE_API_KEY
    });

    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?${params}`
    );

    if (!res.ok) return null;

    const data = youtubeMusicSearchSchema.parse(await res.json());
    
    if (data.items.length === 0) return null;

    // Get the first result that matches the criteria
    const video = data.items[0];
    
    // Verify if the title and artist roughly match
    const normalizedSearchTitle = `${title} ${artist}`.toLowerCase();
    const normalizedResultTitle = `${video.snippet.title} ${video.snippet.channelTitle}`.toLowerCase();
    
    // Simple matching - if the result contains both title and artist
    if (!normalizedResultTitle.includes(title.toLowerCase()) || 
        !normalizedResultTitle.includes(artist.toLowerCase())) {
      return null;
    }

    return {
      platform: 'youtubeMusic' as const,
      url: `https://music.youtube.com/watch?v=${video.id.videoId}`
    };
  } catch (error) {
    console.error('Failed to search YouTube Music:', error);
    return null;
  }
}
