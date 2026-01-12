import { useParams, useLocation } from "wouter";
import { useCommunity, useJoinCommunity } from "@/hooks/use-communities";
import { useCommunityPosts } from "@/hooks/use-posts";
import { Navigation } from "@/components/Navigation";
import { PostCard } from "@/components/PostCard";
import { CreatePostModal } from "@/components/CreatePostModal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Lock, Users } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function Community() {
  const { slug } = useParams<{ slug: string }>();
  const [_, setLocation] = useLocation();
  const { user } = useAuth();
  
  const { data: community, isLoading: loadingCommunity } = useCommunity(slug);
  const { data: posts, isLoading: loadingPosts, error: postsError } = useCommunityPosts(slug);
  const joinCommunity = useJoinCommunity();

  const isLocked = postsError?.message === "Forbidden" || posts === null;
  const isOwner = user?.id === community?.artistId;

  const handleJoin = () => {
    if (!user) {
      setLocation("/api/login");
      return;
    }
    if (community) {
      joinCommunity.mutate(community.id);
    }
  };

  if (loadingCommunity) return <CommunitySkeleton />;
  if (!community) return <div className="text-center py-20">Community not found</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="lg:pl-64 min-h-screen pb-20 lg:pb-0">
        {/* Cover Header */}
        <div className="relative h-64 md:h-80 w-full bg-secondary">
          {community.coverImageUrl && (
            <img 
              src={community.coverImageUrl} 
              alt={community.name} 
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          
          <div className="absolute -bottom-12 left-0 w-full px-4 md:px-8 flex items-end justify-between container mx-auto max-w-5xl">
            <div className="flex items-end gap-6">
              <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background shadow-xl">
                <AvatarImage src={community.profileImageUrl || undefined} />
                <AvatarFallback className="text-2xl bg-primary text-white">{community.name[0]}</AvatarFallback>
              </Avatar>
              <div className="pb-4 mb-2">
                <h1 className="text-3xl md:text-4xl font-display font-bold text-white shadow-sm">{community.name}</h1>
                <p className="text-gray-300 text-sm md:text-base max-w-md line-clamp-1">{community.description}</p>
              </div>
            </div>
            
            <div className="hidden md:block pb-4 mb-2">
               {!community.isSubscribed && !isOwner ? (
                 <Button size="lg" onClick={handleJoin} disabled={joinCommunity.isPending} className="rounded-full shadow-xl bg-white text-black hover:bg-gray-200 font-bold px-8">
                   {joinCommunity.isPending ? "Joining..." : `Join for $${(community.subscriptionPrice / 100).toFixed(2)}`}
                 </Button>
               ) : (
                 <div className="px-6 py-2 bg-secondary/80 backdrop-blur-md rounded-full border border-white/10 text-sm font-medium flex items-center gap-2">
                   <Users className="w-4 h-4" /> Member
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="container max-w-3xl mx-auto px-4 pt-20 pb-12">
          {/* Mobile Join Button */}
          <div className="md:hidden mb-8">
             {!community.isSubscribed && !isOwner && (
               <Button size="lg" onClick={handleJoin} className="w-full rounded-full bg-white text-black hover:bg-gray-200 font-bold">
                 Join Community
               </Button>
             )}
          </div>

          {/* Create Post (Artist Only) */}
          {isOwner && (
            <div className="mb-8 flex items-center justify-between p-4 bg-secondary/20 rounded-2xl border border-white/5">
              <p className="text-muted-foreground">Share something with your fans...</p>
              <CreatePostModal communityId={community.id} />
            </div>
          )}

          {/* Feed */}
          <div className="space-y-6">
            {isLocked ? (
               <div className="text-center py-20 space-y-6 bg-secondary/10 rounded-3xl border border-white/5">
                 <div className="w-20 h-20 bg-secondary/30 rounded-full flex items-center justify-center mx-auto">
                   <Lock className="w-10 h-10 text-muted-foreground" />
                 </div>
                 <div>
                   <h3 className="text-2xl font-bold font-display">Members Only Community</h3>
                   <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                     Join {community.name} to unlock exclusive posts, music, and videos.
                   </p>
                 </div>
                 <Button size="lg" onClick={handleJoin} className="rounded-full bg-primary px-8">
                   Unlock Access
                 </Button>
               </div>
            ) : loadingPosts ? (
              [1, 2, 3].map(i => <Skeleton key={i} className="h-64 w-full rounded-2xl bg-secondary/30" />)
            ) : posts?.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No posts yet.</div>
            ) : (
              posts?.map(post => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function CommunitySkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="lg:pl-64">
        <div className="h-80 bg-secondary/30 animate-pulse" />
        <div className="container max-w-3xl mx-auto px-4 pt-12 space-y-8">
           <Skeleton className="h-12 w-3/4 rounded-xl" />
           <Skeleton className="h-64 w-full rounded-2xl" />
           <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </main>
    </div>
  );
}
