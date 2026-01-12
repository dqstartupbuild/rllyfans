import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/hooks/use-auth";
import { useMyProfile, useUpdateProfile } from "@/hooks/use-user-profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useMyProfile();
  const updateProfile = useUpdateProfile();

  const [formData, setFormData] = useState({
    bio: "",
    location: "",
    website: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        bio: profile.bio || "",
        location: profile.location || "",
        website: profile.website || "",
      });
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(formData);
  };

  if (!user) return null; // Or redirect

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="lg:pl-64 min-h-screen pb-20 lg:pb-0">
        <div className="container max-w-2xl mx-auto px-4 py-12">
          <header className="mb-10 text-center">
             <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-primary">
               <AvatarImage src={user.profileImageUrl || undefined} />
               <AvatarFallback className="text-2xl bg-secondary">{user.firstName?.[0]}</AvatarFallback>
             </Avatar>
             <h1 className="text-2xl font-bold font-display">{user.firstName} {user.lastName}</h1>
             <p className="text-muted-foreground">{user.email}</p>
          </header>

          <div className="bg-card border border-white/5 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold font-display mb-6">Profile Settings</h2>
            
            {isLoading ? (
              <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea 
                    placeholder="Tell us about yourself..."
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="min-h-[120px] bg-secondary/30 border-white/10"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input 
                      placeholder="e.g. Los Angeles, CA"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="bg-secondary/30 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Website</Label>
                    <Input 
                      placeholder="https://"
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                      className="bg-secondary/30 border-white/10"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={updateProfile.isPending}
                    className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground min-w-[120px]"
                  >
                    {updateProfile.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
