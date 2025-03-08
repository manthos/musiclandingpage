import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Track } from "@shared/schema";
import LandingPreview from "@/components/landing-preview";
import AnalyticsForm from "@/components/analytics-form";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  const { id } = useParams();

  const { data: track, isLoading } = useQuery<Track>({
    queryKey: [`/api/tracks/${id}`],
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!track) {
    return <div>Track not found</div>;
  }

  return (
    <>
      {track.analytics?.gaId && (
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${track.analytics.gaId}`} />
      )}
      {track.analytics?.fbPixelId && (
        <script async src={`https://connect.facebook.net/en_US/fbevents.js`} />
      )}
      <div className="min-h-screen bg-gradient-to-b from-background to-muted">
        <div className="max-w-4xl mx-auto p-6">
          <LandingPreview track={track} />
          
          <Card className="mt-8">
            <CardContent className="p-6">
              <AnalyticsForm trackId={parseInt(id)} analytics={track.analytics} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
