import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Music, Users, ShieldCheck, Zap } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold">R</div>
            <span className="font-display font-bold text-xl">Rlly Fans</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/api/login">
              <Button variant="ghost" className="hidden sm:inline-flex">Sign In</Button>
            </Link>
            <Link href="/api/login">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 rounded-full px-6">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 container mx-auto px-4">
        {/* Abstract Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] z-0 pointer-events-none opacity-20">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '7s' }}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-white/10 backdrop-blur-sm animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm font-medium text-muted-foreground">The future of artist communities</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight leading-[1.1]">
            Turn Your Fanbase into a <br/>
            <span className="text-gradient-primary">Real Community</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Create exclusive spaces, share unreleased content, and monetize your passion directly with your biggest fans. No algorithms, just connection.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/api/login">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full bg-white text-black hover:bg-gray-200 shadow-xl shadow-white/10 transition-transform hover:scale-105">
                Start Creating Free
              </Button>
            </Link>
            <Link href="/discover">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full border-white/20 hover:bg-white/5 backdrop-blur-sm gap-2">
                Explore Communities <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-secondary/20 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Music} 
              title="Exclusive Content" 
              desc="Share demos, unreleased tracks, and behind-the-scenes videos directly with your subscribers." 
            />
            <FeatureCard 
              icon={Users} 
              title="Direct Connection" 
              desc="Build a space where fans can connect with you and each other without algorithm interference." 
            />
            <FeatureCard 
              icon={Zap} 
              title="Sustainable Income" 
              desc="Set your own subscription prices and get paid directly for the value you create." 
            />
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-secondary/50 to-secondary/30 border border-white/10 rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5"></div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 relative z-10">Ready to launch?</h2>
          <p className="text-muted-foreground mb-8 relative z-10">Join thousands of artists building their independence today.</p>
          <Link href="/api/login">
            <Button size="lg" className="relative z-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-12 px-8">
              Join Rlly Fans Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="p-8 rounded-2xl bg-card/50 border border-white/5 hover:border-primary/30 transition-colors group">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold font-display mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}
