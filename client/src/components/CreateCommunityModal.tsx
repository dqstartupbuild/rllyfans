import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCommunity } from "@/hooks/use-communities";
import { ObjectUploader } from "@/components/ObjectUploader";
import { UploadCloud, Image as ImageIcon } from "lucide-react";

export function CreateCommunityModal() {
  const [open, setOpen] = useState(false);
  const createCommunity = useCreateCommunity();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    subscriptionPrice: 0,
    coverImageUrl: "",
    profileImageUrl: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCommunity.mutate(formData, {
      onSuccess: () => setOpen(false),
    });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    setFormData({ ...formData, name, slug });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25">
          Create Community
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card border-white/10 text-foreground">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">Create Your Community</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Community Name</Label>
            <Input 
              id="name" 
              required
              placeholder="e.g. Taylor's Fan Club"
              value={formData.name}
              onChange={handleNameChange}
              className="bg-secondary/50 border-white/10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug</Label>
            <div className="flex items-center gap-2 text-muted-foreground bg-secondary/30 p-2 rounded-md border border-white/5">
              <span className="text-sm">rlly.fans/c/</span>
              <Input 
                id="slug" 
                required
                value={formData.slug}
                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                className="bg-transparent border-none h-auto p-0 focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="What is this community about?"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="bg-secondary/50 border-white/10"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cover Image</Label>
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
                  if (file) setFormData(prev => ({ ...prev, coverImageUrl: file.uploadURL }));
                }}
                buttonClassName="w-full h-24 bg-secondary/30 border border-dashed border-white/20 hover:bg-secondary/50"
              >
                {formData.coverImageUrl ? (
                   <img src={formData.coverImageUrl} className="w-full h-full object-cover rounded-md" alt="Cover" />
                ) : (
                   <div className="flex flex-col items-center gap-2 text-muted-foreground">
                     <ImageIcon className="w-6 h-6" />
                     <span className="text-xs">Upload Cover</span>
                   </div>
                )}
              </ObjectUploader>
            </div>
            
            <div className="space-y-2">
              <Label>Subscription Price ($)</Label>
              <Input 
                type="number"
                min="0"
                step="1"
                placeholder="0"
                value={formData.subscriptionPrice / 100} // Display in dollars
                onChange={(e) => setFormData({...formData, subscriptionPrice: parseFloat(e.target.value) * 100})}
                className="bg-secondary/50 border-white/10"
              />
              <p className="text-xs text-muted-foreground">Monthly price in USD. Set 0 for free.</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button 
              type="submit" 
              disabled={createCommunity.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              {createCommunity.isPending ? "Creating..." : "Launch Community"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
