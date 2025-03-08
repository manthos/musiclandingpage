import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTrackSchema, platformSchema, type Track } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getSpotifyTrackInfo } from "@/lib/spotify";
import { getYoutubeVideoInfo } from "@/lib/youtube";
import { searchAcrossPlatforms, platforms } from "@/lib/streaming-platforms";

interface TrackFormProps {
  onPreview: (data: Track) => void;
  onSubmit: (data: Track) => void;
  isSubmitting: boolean;
}

export default function TrackForm({ onPreview, onSubmit, isSubmitting }: TrackFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<Track>({
    resolver: zodResolver(insertTrackSchema),
    defaultValues: {
      title: "",
      artist: "",
      artwork: "",
      description: "",
      customLinks: [],
      socialLinks: [],
      analytics: {},
    },
  });

  async function fetchTrackInfo(platform: "spotify" | "youtube", url: string | null) {
    if (!url) return;

    try {
      setIsLoading(true);
      const result = await platformSchema.parseAsync({ url });

      const info = platform === "spotify"
        ? await getSpotifyTrackInfo(result.url)
        : await getYoutubeVideoInfo(result.url);

      // Search for the track on other platforms
      const streamingLinks = await searchAcrossPlatforms(info.title, info.artist);

      const formData = {
        ...form.getValues(),
        ...info,
        [platform === "spotify" ? "spotifyUrl" : "youtubeUrl"]: url,
        customLinks: streamingLinks.map(link => ({
          label: `Listen on ${platforms[link.platform].name}`,
          url: link.url
        }))
      };

      form.reset(formData);
      onPreview(formData as Track);

      toast({
        title: "Success",
        description: "Track information loaded successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load track information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="spotifyUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Spotify URL</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <Input 
                    {...field} 
                    value={field.value || ''} 
                    placeholder="https://open.spotify.com/track/..." 
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => fetchTrackInfo("spotify", field.value)}
                    disabled={isLoading}
                  >
                    Load
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="youtubeUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>YouTube URL</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <Input 
                    {...field} 
                    value={field.value || ''} 
                    placeholder="https://youtube.com/watch?v=..." 
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => fetchTrackInfo("youtube", field.value)}
                    disabled={isLoading}
                  >
                    Load
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  value={field.value || ''} 
                  placeholder="Enter track description..." 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          Create Landing Page
        </Button>
      </form>
    </Form>
  );
}