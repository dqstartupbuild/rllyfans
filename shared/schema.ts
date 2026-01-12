import { pgTable, text, serial, integer, boolean, timestamp, jsonb, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users as authUsers } from "./models/auth";

// Export auth models so they are available to the app
export * from "./models/auth";

// === TABLE DEFINITIONS ===

// Communities created by artists
export const communities = pgTable("communities", {
  id: serial("id").primaryKey(),
  artistId: text("artist_id").notNull().references(() => authUsers.id),
  name: text("name").notNull(),
  description: text("description"),
  slug: text("slug").notNull().unique(), // for /c/artist-name
  coverImageUrl: text("cover_image_url"),
  profileImageUrl: text("profile_image_url"),
  subscriptionPrice: integer("subscription_price").notNull().default(0), // in cents
  createdAt: timestamp("created_at").defaultNow(),
});

// Posts within a community
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  communityId: integer("community_id").notNull().references(() => communities.id),
  authorId: text("author_id").notNull().references(() => authUsers.id),
  title: text("title"),
  content: text("content"),
  mediaUrl: text("media_url"),
  mediaType: text("media_type").default("text"), // text, image, video, audio
  isPublic: boolean("is_public").default(false), // true = visible to non-members
  createdAt: timestamp("created_at").defaultNow(),
});

// Comments on posts
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => posts.id),
  authorId: text("author_id").notNull().references(() => authUsers.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Likes on posts
export const likes = pgTable("likes", {
  postId: integer("post_id").notNull().references(() => posts.id),
  userId: text("user_id").notNull().references(() => authUsers.id),
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => ({
  pk: primaryKey(t.postId, t.userId),
}));

// Subscriptions (Users -> Communities)
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => authUsers.id),
  communityId: integer("community_id").notNull().references(() => communities.id),
  status: text("status").notNull().default("active"), // active, cancelled, expired
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Profiles (Extended info)
export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => authUsers.id).unique(),
  bio: text("bio"),
  location: text("location"),
  website: text("website"),
  createdAt: timestamp("created_at").defaultNow(),
});


// === SCHEMAS ===

export const insertCommunitySchema = createInsertSchema(communities).omit({ id: true, createdAt: true });
export const insertPostSchema = createInsertSchema(posts).omit({ id: true, createdAt: true });
export const insertCommentSchema = createInsertSchema(comments).omit({ id: true, createdAt: true });
export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({ id: true, createdAt: true });

// === EXPLICIT API TYPES ===

export type Community = typeof communities.$inferSelect;
export type InsertCommunity = z.infer<typeof insertCommunitySchema>;

export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;

export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

export type Subscription = typeof subscriptions.$inferSelect;

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;

// Request Types
export type CreateCommunityRequest = InsertCommunity;
export type CreatePostRequest = InsertPost;
export type CreateCommentRequest = InsertComment;
export type UpdateUserProfileRequest = Partial<InsertUserProfile>;

// Response Types (often includes relations, but for now simple)
export type CommunityResponse = Community & { isSubscribed?: boolean };
export type PostResponse = Post & { 
  author?: { firstName: string | null; lastName: string | null; profileImageUrl: string | null };
  likesCount?: number;
  commentsCount?: number;
  isLiked?: boolean;
};
export type CommentResponse = Comment & {
  author?: { firstName: string | null; lastName: string | null; profileImageUrl: string | null };
};

