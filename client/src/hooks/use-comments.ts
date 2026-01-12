import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertComment } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function usePostComments(postId: number) {
  return useQuery({
    queryKey: [api.comments.list.path, postId],
    queryFn: async () => {
      const url = buildUrl(api.comments.list.path, { id: postId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch comments");
      return api.comments.list.responses[200].parse(await res.json());
    },
    enabled: !!postId,
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ postId, content }: { postId: number, content: string }) => {
      const url = buildUrl(api.comments.create.path, { id: postId });
      const res = await fetch(url, {
        method: api.comments.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to post comment");
      return api.comments.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: [api.comments.list.path, postId] });
      toast({
        title: "Comment posted",
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
