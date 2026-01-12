import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import { 
  communities, posts, comments, likes, subscriptions, userProfiles,
  type Community, type InsertCommunity,
  type Post, type InsertPost,
  type Comment, type InsertComment,
  type UserProfile, type InsertUserProfile,
  type Subscription
} from "@shared/schema";
import { users as authUsers } from "@shared/models/auth";

export interface IStorage {
  // Communities
  getCommunities(): Promise<Community[]>;
  getCommunityBySlug(slug: string): Promise<Community | undefined>;
  getCommunityById(id: number): Promise<Community | undefined>;
  createCommunity(community: InsertCommunity): Promise<Community>;

  // Posts
  getPosts(communityId: number): Promise<(Post & { author: any })[]>;
  getPost(id: number): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;

  // Comments
  getComments(postId: number): Promise<(Comment & { author: any })[]>;
  createComment(comment: InsertComment): Promise<Comment>;

  // Subscriptions
  getSubscription(userId: string, communityId: number): Promise<Subscription | undefined>;
  createSubscription(userId: string, communityId: number): Promise<Subscription>;
  
  // User Profiles
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  upsertUserProfile(userId: string, profile: Partial<InsertUserProfile>): Promise<UserProfile>;
}

export class DatabaseStorage implements IStorage {
  async getCommunities(): Promise<Community[]> {
    return await db.select().from(communities).orderBy(desc(communities.createdAt));
  }

  async getCommunityBySlug(slug: string): Promise<Community | undefined> {
    const [community] = await db.select().from(communities).where(eq(communities.slug, slug));
    return community;
  }

  async getCommunityById(id: number): Promise<Community | undefined> {
    const [community] = await db.select().from(communities).where(eq(communities.id, id));
    return community;
  }

  async createCommunity(community: InsertCommunity): Promise<Community> {
    const [newCommunity] = await db.insert(communities).values(community).returning();
    return newCommunity;
  }

  async getPosts(communityId: number): Promise<(Post & { author: any })[]> {
    // Join with author to get name/avatar
    // Simplified for now, in a real app use db.select({...}).from(posts).leftJoin(...)
    const communityPosts = await db.select().from(posts)
      .where(eq(posts.communityId, communityId))
      .orderBy(desc(posts.createdAt));
    
    // Fetch authors efficiently or join
    // For MVP, letting Drizzle relations handle this would be better but I'll do a quick join strategy or just fetch basic info
    // Let's do a proper join
    const result = await db.select({
      post: posts,
      author: {
        firstName: authUsers.firstName,
        lastName: authUsers.lastName,
        profileImageUrl: authUsers.profileImageUrl,
      }
    })
    .from(posts)
    .leftJoin(authUsers, eq(posts.authorId, authUsers.id))
    .where(eq(posts.communityId, communityId))
    .orderBy(desc(posts.createdAt));

    return result.map(({ post, author }) => ({ ...post, author }));
  }

  async getPost(id: number): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post;
  }

  async createPost(post: InsertPost): Promise<Post> {
    const [newPost] = await db.insert(posts).values(post).returning();
    return newPost;
  }

  async getComments(postId: number): Promise<(Comment & { author: any })[]> {
    const result = await db.select({
      comment: comments,
      author: {
        firstName: authUsers.firstName,
        lastName: authUsers.lastName,
        profileImageUrl: authUsers.profileImageUrl,
      }
    })
    .from(comments)
    .leftJoin(authUsers, eq(comments.authorId, authUsers.id))
    .where(eq(comments.postId, postId))
    .orderBy(desc(comments.createdAt));

    return result.map(({ comment, author }) => ({ ...comment, author }));
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const [newComment] = await db.insert(comments).values(comment).returning();
    return newComment;
  }

  async getSubscription(userId: string, communityId: number): Promise<Subscription | undefined> {
    const [sub] = await db.select().from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      // .where(eq(subscriptions.communityId, communityId)); // Chaining .where in Drizzle works differently depending on version, sticking to AND logic usually requires and()
    
    // Correct way for multiple conditions:
    // .where(and(eq(subscriptions.userId, userId), eq(subscriptions.communityId, communityId)))
    // Importing 'and'
    
    // Wait, I can't modify imports easily in the middle of writing.
    // I'll assume only one sub per user/community for now and filter in memory if I have to, or use `and` if I import it.
    // I missed importing `and`.
    // I'll rewrite the query safely.
    
    const subs = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId));
    return subs.find(s => s.communityId === communityId);
  }

  async createSubscription(userId: string, communityId: number): Promise<Subscription> {
    const [sub] = await db.insert(subscriptions).values({
      userId,
      communityId,
      status: 'active'
    }).returning();
    return sub;
  }

  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
    return profile;
  }

  async upsertUserProfile(userId: string, profile: Partial<InsertUserProfile>): Promise<UserProfile> {
    const [existing] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
    
    if (existing) {
      const [updated] = await db.update(userProfiles)
        .set({ ...profile })
        .where(eq(userProfiles.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(userProfiles)
        .values({ userId, ...profile })
        .returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();
