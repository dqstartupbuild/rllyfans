import type { Express } from "express";
import type { Server } from "http";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { communities, posts } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Replit Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // Setup Object Storage
  registerObjectStorageRoutes(app);

  // === Communities ===
  
  app.get(api.communities.list.path, async (req, res) => {
    const list = await storage.getCommunities();
    res.json(list);
  });

  app.get(api.communities.get.path, async (req, res) => {
    const slug = req.params.slug;
    const community = await storage.getCommunityBySlug(slug);
    
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    let isSubscribed = false;
    if (req.isAuthenticated()) {
      const userId = (req.user as any).claims.sub;
      const sub = await storage.getSubscription(userId, community.id);
      isSubscribed = !!sub && sub.status === 'active';
    }

    res.json({ ...community, isSubscribed });
  });

  app.post(api.communities.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const input = api.communities.create.input.parse(req.body);
      const userId = (req.user as any).claims.sub;
      
      const community = await storage.createCommunity({
        ...input,
        artistId: userId
      });
      res.status(201).json(community);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post('/api/communities/:id/join', async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    const communityId = parseInt(req.params.id);
    const userId = (req.user as any).claims.sub;
    
    const community = await storage.getCommunityById(communityId);
    if (!community) return res.status(404).json({ message: "Community not found" });

    // Mock payment/free join
    const sub = await storage.createSubscription(userId, communityId);
    res.json(sub);
  });


  // === Posts ===

  app.get(api.posts.list.path, async (req, res) => {
    const slug = req.params.slug;
    const community = await storage.getCommunityBySlug(slug);
    
    if (!community) return res.status(404).json({ message: "Community not found" });

    // Check access
    let canAccess = false;
    if (req.isAuthenticated()) {
      const userId = (req.user as any).claims.sub;
      const sub = await storage.getSubscription(userId, community.id);
      canAccess = !!sub || community.artistId === userId;
    }

    const allPosts = await storage.getPosts(community.id);
    
    if (canAccess) {
      res.json(allPosts);
    } else {
      // Filter for public posts only
      const publicPosts = allPosts.filter(p => p.isPublic);
      res.json(publicPosts);
    }
  });

  app.post('/api/communities/:id/posts', async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    const communityId = parseInt(req.params.id);
    const userId = (req.user as any).claims.sub;

    const community = await storage.getCommunityById(communityId);
    if (!community) return res.status(404).json({ message: "Community not found" });
    
    // Only artist can post (simple rule for now)
    if (community.artistId !== userId) {
      return res.status(403).json({ message: "Only the artist can post" });
    }

    try {
      // We parse the BODY input, which omits communityId/authorId
      const input = api.posts.create.input.parse(req.body);
      
      const post = await storage.createPost({
        ...input,
        communityId,
        authorId: userId
      });
      res.status(201).json(post);
    } catch (err) {
      console.error(err);
      res.status(400).json({ message: "Validation error" });
    }
  });

  app.get(api.posts.get.path, async (req, res) => {
    const post = await storage.getPost(Number(req.params.id));
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  });

  // === Comments ===

  app.get(api.comments.list.path, async (req, res) => {
    const comments = await storage.getComments(Number(req.params.id));
    res.json(comments);
  });

  app.post(api.comments.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const input = api.comments.create.input.parse(req.body);
      const userId = (req.user as any).claims.sub;
      
      const comment = await storage.createComment({
        ...input,
        postId: Number(req.params.id),
        authorId: userId
      });
      res.status(201).json(comment);
    } catch (err) {
       res.status(400).json({ message: "Error" });
    }
  });

  // === Users ===

  app.get(api.users.me.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(404).json(null);
    const userId = (req.user as any).claims.sub;
    const profile = await storage.getUserProfile(userId);
    res.json(profile || null);
  });

  app.put(api.users.updateProfile.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const userId = (req.user as any).claims.sub;
    
    try {
      const input = api.users.updateProfile.input.parse(req.body);
      const profile = await storage.upsertUserProfile(userId, input);
      res.json(profile);
    } catch (err) {
      res.status(400).json({ message: "Validation error" });
    }
  });

  // Seed Data Endpoint (temporary)
  app.post('/api/seed', async (req, res) => {
    // Only allow if no communities exist? Or just add some.
    const communitiesList = await storage.getCommunities();
    if (communitiesList.length === 0) {
      // Create a mock artist user first? 
      // Auth users are separate. We can't easily seed them without auth flow.
      // But we can create communities linked to a placeholder or wait for first user.
      
      // We'll skip seeding for now as it depends on having a valid User ID from Replit Auth.
      res.json({ message: "Seed skipped - requires auth user" });
    } else {
      res.json({ message: "Already seeded" });
    }
  });

  return httpServer;
}
