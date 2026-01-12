import { Navigation } from "@/components/Navigation";
import { useCommunities } from "@/hooks/use-communities";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: communities, isLoading } = useCommunities();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="lg:pl-64 min-h-screen pb-20 lg:pb-0">
        <div className="container max-w-5xl mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-display font-bold">Welcome Home</h1>
            <p className="text-muted-foreground mt-2">Here's what's happening in your communities.</p>
          </header>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <Skeleton key={i} className="h-64 rounded-2xl bg-secondary/50" />
              ))}
            </div>
          ) : (
            <>
              {communities?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-secondary/20 rounded-3xl border border-white/5 border-dashed">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Plus className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">No communities yet</h3>
                    <p className="text-muted-foreground mt-1 max-w-sm mx-auto">
                      Join a community to see posts here, or create your own to start building a fanbase.
                    </p>
                  </div>
                  <Link href="/discover">
                    <Button className="rounded-full">Discover Communities</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {communities?.map((community) => (
                    <Link key={community.id} href={`/c/${community.slug}`}>
                      <div className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-card border border-white/5 hover:border-primary/50 transition-all cursor-pointer">
                        {/* Cover Image */}
                        <div className="absolute inset-0">
                          {community.coverImageUrl ? (
                            <img src={community.coverImageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={community.name} />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-secondary to-background" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                        </div>
                        
                        {/* Content */}
                        <div className="absolute bottom-0 left-0 w-full p-6">
                          <h3 className="text-xl font-bold font-display text-white mb-1">{community.name}</h3>
                          <p className="text-sm text-gray-300 line-clamp-2">{community.description}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
