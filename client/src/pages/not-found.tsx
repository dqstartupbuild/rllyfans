import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md bg-card border-white/10 text-center py-12">
        <CardContent>
          <div className="flex mb-6 justify-center">
            <AlertCircle className="h-16 w-16 text-destructive opacity-80" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-3">404 Page Not Found</h1>
          <p className="text-muted-foreground mb-8 text-lg">
            This page seems to have gone missing in the void.
          </p>
          <Link href="/">
            <Button size="lg" className="rounded-full bg-primary hover:bg-primary/90">
              Return Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
