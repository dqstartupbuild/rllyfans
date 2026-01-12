import { Navigation } from "@/components/Navigation";
import { useCommunities } from "@/hooks/use-communities";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Discover() {
  const { data: communities, isLoading } = useCommunities();
  const [search, setSearch] = useState("");

  const filteredCommunities = communities?.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="lg:pl-64 min-h-screen pb-20 lg:pb-0">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-display font-bold">Discover</h1>
              <p className="text-muted-foreground mt-2 text-lg">Find your next favorite community.</p>
            </div>
            
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search artists..." 
                className="pl-10 h-12 rounded-full bg-secondary/50 border-white/10 focus:bg-secondary transition-colors"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </header>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-80 rounded-2xl bg-secondary/30" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCommunities?.map((community) => (
                <Link key={community.id} href={`/c/${community.slug}`}>
                  <div className="group bg-card hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 rounded-2xl overflow-hidden border border-white/5 cursor-pointer h-full flex flex-col">
                    <div className="aspect-square relative overflow-hidden bg-secondary">
                      {community.coverImageUrl ? (
                        <img 
                          src={community.coverImageUrl} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          alt={community.name} 
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                      
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold font-display text-white truncate">{community.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm">
                            {community.subscriptionPrice === 0 ? "Free" : `$${(community.subscriptionPrice / 100)}/mo`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
