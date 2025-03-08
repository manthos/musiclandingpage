import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { analyticsSchema } from "@shared/schema";
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
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface AnalyticsFormProps {
  trackId: number;
  analytics: {
    gaId?: string;
    fbPixelId?: string;
  };
}

export default function AnalyticsForm({ trackId, analytics }: AnalyticsFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(analyticsSchema),
    defaultValues: analytics,
  });

  const updateAnalytics = useMutation({
    mutationFn: async (data: typeof analytics) => {
      await apiRequest("PATCH", `/api/tracks/${trackId}`, {
        analytics: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/tracks/${trackId}`] });
      toast({
        title: "Success",
        description: "Analytics settings updated",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update analytics settings",
        variant: "destructive",
      });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => updateAnalytics.mutate(data))}
        className="space-y-4"
      >
        <h2 className="text-lg font-semibold mb-4">Analytics Settings</h2>

        <FormField
          control={form.control}
          name="gaId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Google Analytics ID</FormLabel>
              <FormControl>
                <Input {...field} placeholder="G-XXXXXXXXXX" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fbPixelId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Facebook Pixel ID</FormLabel>
              <FormControl>
                <Input {...field} placeholder="XXXXXXXXXX" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={updateAnalytics.isPending}>
          Update Analytics
        </Button>
      </form>
    </Form>
  );
}
