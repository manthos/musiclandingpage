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
    const searchQuery = `${title} ${artist}`; // Removed 'audio' suffix
    const params = new URLSearchParams({
      part: 'snippet',
      q: searchQuery,
      type: 'video',
      videoCategoryId: '10', // Music category
      maxResults: '10', // Increased results for better matching
      key: import.meta.env.VITE_YOUTUBE_API_KEY
    });

    console.log('Searching YouTube Music for:', { title, artist });

    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?${params}`
    );

    if (!res.ok) {
      console.error('YouTube Music API error:', await res.text());
      return null;
    }

    const data = youtubeMusicSearchSchema.parse(await res.json());

    if (data.items.length === 0) {
      console.log('No YouTube Music results found for:', searchQuery);
      return null;
    }

    // Look through results for a match
    for (const video of data.items) {
      const videoTitle = video.snippet.title.toLowerCase();
      const videoArtist = video.snippet.channelTitle.toLowerCase();
      const searchTitle = title.toLowerCase();
      const searchArtist = artist.toLowerCase();

      console.log('Checking YouTube Music result:', {
        videoTitle,
        videoArtist,
        searchTitle,
        searchArtist
      });

      // Very lenient matching - just check if video title contains part of the song name
      // or if the channel matches part of the artist name
      const titleMatch = videoTitle.includes(searchTitle) || searchTitle.includes(videoTitle);
      const artistMatch = videoArtist.includes(searchArtist) || searchArtist.includes(videoArtist);

      if (titleMatch) {
        console.log('Found YouTube Music match:', {
          searchTitle: title,
          searchArtist: artist,
          foundTitle: video.snippet.title,
          foundArtist: video.snippet.channelTitle
        });

        return {
          platform: 'youtubeMusic' as const,
          url: `https://music.youtube.com/watch?v=${video.id.videoId}`
        };
      }
    }

    console.log('No matching YouTube Music track found for:', { title, artist });
    return null;
  } catch (error) {
    console.error('Failed to search YouTube Music:', error);
    return null;
  }
}