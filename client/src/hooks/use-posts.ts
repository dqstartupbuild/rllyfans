import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertPost } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useCommunityPosts(slug: string) {
  return useQuery({
    queryKey: [api.posts.list.path, slug],
    queryFn: async () => {
      const url = buildUrl(api.posts.list.path, { slug });
      const res = await fetch(url, { credentials: "include" });
      
      if (res.status === 403) {
        // Not a member - return null or specific error structure
        // But for react-query we might want to throw or return a specific state
        // Let's return null to signify "locked"
        return null; 
      }
      
      if (res.status === 404) throw new Error("Community not found");
      if (!res.ok) throw new Error("Failed to fetch posts");
      
      return api.posts.list.responses[200].parse(await res.json());
    },
    enabled: !!slug,
  });
}

export function usePost(id: number) {
  return useQuery({
    queryKey: [api.posts.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.posts.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch post");
      return api.posts.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ communityId, ...data }: Omit<InsertPost, 'authorId'> & { communityId: number }) => {
      // Note: communityId in URL, authorId handled by session
      const url = buildUrl(api.posts.create.path, { id: communityId });
      const res = await fetch(url, {
        method: api.posts.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create post");
      }
      return api.posts.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      // Invalidate posts list for the community. Ideally we'd need the slug here, 
      // but invalidating all posts lists is safer or passing slug in context.
      // For now, let's just invalidate all lists.
      queryClient.invalidateQueries({ queryKey: [api.posts.list.path] });
      toast({
        title: "Post created",
        description: "Your post is now live.",
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
