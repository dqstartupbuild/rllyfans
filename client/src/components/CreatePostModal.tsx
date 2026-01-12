import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreatePost } from "@/hooks/use-posts";
import { ObjectUploader } from "@/components/ObjectUploader";
import { Plus, Image as ImageIcon, Music, Video, Lock } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface Props {
  communityId: number;
}

export function CreatePostModal({ communityId }: Props) {
  const [open, setOpen] = useState(false);
  const createPost = useCreatePost();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    mediaUrl: "",
    mediaType: "text" as "text" | "image" | "video" | "audio",
    isPublic: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPost.mutate({ ...formData, communityId }, {
      onSuccess: () => {
        setOpen(false);
        setFormData({ title: "", content: "", mediaUrl: "", mediaType: "text", isPublic: false });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-lg shadow-primary/25">
          <Plus className="w-4 h-4" /> New Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-card border-white/10 text-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl font-display">Create New Post</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label>Post Type</Label>
            <div className="flex gap-2">
              {[
                { type: 'text', icon: Plus, label: 'Text' },
                { type: 'image', icon: ImageIcon, label: 'Image' },
                { type: 'audio', icon: Music, label: 'Audio' },
                { type: 'video', icon: Video, label: 'Video' },
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setFormData({ ...formData, mediaType: item.type as any })}
                  className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                    formData.mediaType === item.type 
                      ? "bg-primary/20 border-primary text-primary" 
                      : "bg-secondary/30 border-transparent hover:bg-secondary/50 text-muted-foreground"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              required
              placeholder="Give your post a title..."
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="bg-secondary/50 border-white/10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea 
              id="content" 
              placeholder="Write something..."
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              className="min-h-[150px] bg-secondary/50 border-white/10"
            />
          </div>

          {formData.mediaType !== 'text' && (
            <div className="space-y-2">
              <Label>Upload Media</Label>
              <ObjectUploader
                onGetUploadParameters={async (file) => {
                  const res = await fetch("/api/uploads/request-url", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }),
                  });
                  const { uploadURL } = await res.json();
                  return { method: "PUT", url: uploadURL, headers: { "Content-Type": file.type } };
                }}
                onComplete={(result) => {
                  const file = result.successful[0];
                  if (file) setFormData(prev => ({ ...prev, mediaUrl: file.uploadURL }));
                }}
                buttonClassName="w-full h-32 bg-secondary/30 border border-dashed border-white/20 hover:bg-secondary/50 rounded-xl"
              >
                {formData.mediaUrl ? (
                  <div className="w-full h-full flex items-center justify-center text-primary font-medium">
                    Media uploaded successfully!
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <UploadCloud className="w-8 h-8" />
                    <span>Click to upload {formData.mediaType}</span>
                  </div>
                )}
              </ObjectUploader>
            </div>
          )}

          <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full text-primary">
                <Lock className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <Label className="text-base">Members Only</Label>
                <p className="text-xs text-muted-foreground">Only subscribed members can see this post</p>
              </div>
            </div>
            <Switch 
              checked={!formData.isPublic}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: !checked }))}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button 
              type="submit" 
              disabled={createPost.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              {createPost.isPending ? "Posting..." : "Publish Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
