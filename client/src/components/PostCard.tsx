import { type PostResponse } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Share2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CustomAudioPlayer } from "./AudioPlayer";
import ReactPlayer from 'react-player';

interface Props {
  post: PostResponse;
  isLocked?: boolean;
}

export function PostCard({ post, isLocked = false }: Props) {
  if (isLocked) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-card border border-white/5 p-6 md:p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center text-center space-y-4 py-8">
          <div className="p-4 bg-secondary/50 rounded-full border border-white/10">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold font-display">Members Only Content</h3>
          <p className="text-muted-foreground max-w-sm">
            Join this community to unlock this post and get access to exclusive content.
          </p>
          <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90">
            Unlock Access
          </Button>
        </div>
        {/* Blur effect behind */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-0" />
      </div>
    );
  }

  return (
    <div className="group bg-card hover:bg-card/80 transition-colors border border-white/5 rounded-2xl overflow-hidden shadow-lg">
      {/* Header */}
      <div className="p-4 md:p-6 flex items-start gap-4">
        <Avatar className="w-10 h-10 border border-white/10">
          <AvatarImage src={post.author?.profileImageUrl || undefined} />
          <AvatarFallback>{post.author?.firstName?.[0] || '?'}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-foreground">
              {post.author?.firstName} {post.author?.lastName}
            </h4>
            <span className="text-xs text-muted-foreground">
              • {post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : 'Just now'}
            </span>
          </div>
          <h3 className="mt-1 text-lg font-bold font-display leading-tight">{post.title}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 md:px-6 pb-4 space-y-4">
        {post.content && (
          <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {post.content}
          </p>
        )}

        {/* Media Rendering */}
        {post.mediaUrl && (
          <div className="rounded-xl overflow-hidden bg-black/40 border border-white/5">
            {post.mediaType === 'image' && (
              <img 
                src={post.mediaUrl} 
                alt={post.title || "Post content"} 
                className="w-full h-auto max-h-[500px] object-contain"
              />
            )}
            
            {post.mediaType === 'video' && (
              <div className="aspect-video">
                <ReactPlayer 
                  url={post.mediaUrl} 
                  width="100%" 
                  height="100%" 
                  controls
                />
              </div>
            )}
            
            {post.mediaType === 'audio' && (
              <div className="p-4">
                <CustomAudioPlayer src={post.mediaUrl} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 md:px-6 py-4 border-t border-white/5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="hover:text-pink-500 hover:bg-pink-500/10 gap-2 px-2">
            <Heart className={`w-5 h-5 ${post.isLiked ? "fill-pink-500 text-pink-500" : ""}`} />
            <span>{post.likesCount || 0}</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="hover:text-blue-400 hover:bg-blue-400/10 gap-2 px-2">
            <MessageCircle className="w-5 h-5" />
            <span>{post.commentsCount || 0}</span>
          </Button>
        </div>
        
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Share2 className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
