import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertCommunity } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useCommunities() {
  return useQuery({
    queryKey: [api.communities.list.path],
    queryFn: async () => {
      const res = await fetch(api.communities.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch communities");
      return api.communities.list.responses[200].parse(await res.json());
    },
  });
}

export function useCommunity(slug: string) {
  return useQuery({
    queryKey: [api.communities.get.path, slug],
    queryFn: async () => {
      const url = buildUrl(api.communities.get.path, { slug });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch community");
      return api.communities.get.responses[200].parse(await res.json());
    },
    enabled: !!slug,
  });
}

export function useCreateCommunity() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertCommunity) => {
      const res = await fetch(api.communities.create.path, {
        method: api.communities.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized");
        const error = await res.json();
        throw new Error(error.message || "Failed to create community");
      }
      return api.communities.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.communities.list.path] });
      toast({
        title: "Community created!",
        description: "Your community is now live.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useJoinCommunity() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (communityId: number) => {
      const url = buildUrl(api.communities.join.path, { id: communityId });
      const res = await fetch(url, {
        method: api.communities.join.method,
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Please log in to join");
        throw new Error("Failed to join community");
      }
      return api.communities.join.responses[200].parse(await res.json());
    },
    onSuccess: (_, communityId) => {
      queryClient.invalidateQueries({ queryKey: [api.communities.list.path] });
      // Invalidate specific community get to update isSubscribed status
      queryClient.invalidateQueries({ queryKey: [api.communities.get.path] }); 
      toast({
        title: "Welcome!",
        description: "You have successfully joined the community.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
