import { type Track } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiSpotify, SiYoutube } from "react-icons/si";

interface LandingPreviewProps {
  track: Track;
}

export default function LandingPreview({ track }: LandingPreviewProps) {
  return (
    <div className="space-y-8">
      <div className="aspect-square relative rounded-lg overflow-hidden">
        <img
          src={track.artwork}
          alt={track.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">{track.title}</h1>
        <p className="text-xl text-muted-foreground">{track.artist}</p>
      </div>

      {track.description && (
        <p className="text-center text-muted-foreground">{track.description}</p>
      )}

      <div className="grid gap-4">
        {track.spotifyUrl && (
          <Button
            className="w-full"
            size="lg"
            onClick={() => window.open(track.spotifyUrl, "_blank")}
          >
            <SiSpotify className="mr-2 h-5 w-5" />
            Listen on Spotify
          </Button>
        )}

        {track.youtubeUrl && (
          <Button
            className="w-full"
            size="lg"
            variant="secondary"
            onClick={() => window.open(track.youtubeUrl, "_blank")}
          >
            <SiYoutube className="mr-2 h-5 w-5" />
            Watch on YouTube
          </Button>
        )}
      </div>

      {track.customLinks && track.customLinks.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="grid gap-2">
              {track.customLinks.map((link, i) => (
                <Button
                  key={i}
                  variant="outline"
                  onClick={() => window.open(link.url, "_blank")}
                >
                  {link.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {track.socialLinks && track.socialLinks.length > 0 && (
        <div className="flex justify-center gap-4">
          {track.socialLinks.map((link, i) => (
            <Button
              key={i}
              size="icon"
              variant="ghost"
              onClick={() => window.open(link.url, "_blank")}
            >
              <span className="sr-only">{link.platform}</span>
              {/* Add social media icons based on platform */}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
