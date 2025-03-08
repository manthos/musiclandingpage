import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";
import TrackForm from "@/components/track-form";
import LandingPreview from "@/components/landing-preview";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Track } from "@shared/schema";

export default function Home() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [previewData, setPreviewData] = useState<Track | null>(null);

  const createTrack = useMutation({
    mutationFn: async (track: Track) => {
      const res = await apiRequest("POST", "/api/tracks", track);
      const data = await res.json();
      return data as Track;
    },
    onSuccess: (track) => {
      toast({
        title: "Success!",
        description: "Your landing page has been created",
      });
      navigate(`/landing/${track.id}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create landing page",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Music className="h-8 w-8" />
            <h1 className="text-4xl font-bold">Music Landing Page Generator</h1>
          </div>
          <p className="text-muted-foreground">
            Create a beautiful landing page for your music release
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <TrackForm
                onPreview={setPreviewData}
                onSubmit={(data) => createTrack.mutate(data)}
                isSubmitting={createTrack.isPending}
              />
            </CardContent>
          </Card>

          <div className="sticky top-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Preview</h2>
                {previewData ? (
                  <LandingPreview track={previewData} />
                ) : (
                  <div className="text-center text-muted-foreground p-8">
                    Enter track details to see preview
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
