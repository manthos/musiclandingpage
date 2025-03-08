import { type Track } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  SiSpotify, 
  SiYoutube,
  SiApplemusic,
  SiSoundcloud,
  SiInstagram,
  SiFacebook,
  SiTiktok
} from "react-icons/si";
import { platforms } from "@/lib/streaming-platforms";

const socialIcons = {
  instagram: SiInstagram,
  facebook: SiFacebook,
  tiktok: SiTiktok,
} as const;

interface LandingPreviewProps {
  track: Track;
}

export default function LandingPreview({ track }: LandingPreviewProps) {
  const getPlatformIcon = (url: string) => {
    if (url.includes('spotify')) return SiSpotify;
    if (url.includes('youtube')) return SiYoutube;
    if (url.includes('apple')) return SiApplemusic;
    if (url.includes('soundcloud')) return SiSoundcloud;
    return null;
  };

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
            onClick={() => window.open(track.spotifyUrl || '', "_blank")}
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
            onClick={() => window.open(track.youtubeUrl || '', "_blank")}
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
              {track.customLinks.map((link, i) => {
                const Icon = getPlatformIcon(link.url);
                return (
                  <Button
                    key={i}
                    variant="outline"
                    onClick={() => window.open(link.url, "_blank")}
                  >
                    {Icon && <Icon className="mr-2 h-4 w-4" />}
                    {link.label}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {track.socialLinks && track.socialLinks.length > 0 && (
        <div className="flex justify-center gap-4">
          {track.socialLinks.map((link, i) => {
            const platform = link.platform as keyof typeof socialIcons;
            const Icon = socialIcons[platform];
            return Icon ? (
              <Button
                key={i}
                size="icon"
                variant="ghost"
                onClick={() => window.open(link.url, "_blank")}
              >
                <Icon className="h-5 w-5" />
                <span className="sr-only">{platform}</span>
              </Button>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}