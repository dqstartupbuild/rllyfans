import { z } from 'zod';
import { insertCommunitySchema, insertPostSchema, insertCommentSchema, insertUserProfileSchema, communities, posts, comments, userProfiles, subscriptions } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  })
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  communities: {
    list: {
      method: 'GET' as const,
      path: '/api/communities',
      responses: {
        200: z.array(z.custom<typeof communities.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/communities/:slug',
      responses: {
        200: z.custom<typeof communities.$inferSelect & { isSubscribed?: boolean }>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/communities',
      input: insertCommunitySchema,
      responses: {
        201: z.custom<typeof communities.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    join: { // For free communities or simulated join
       method: 'POST' as const,
       path: '/api/communities/:id/join',
       responses: {
         200: z.custom<typeof subscriptions.$inferSelect>(),
         401: errorSchemas.unauthorized,
         404: errorSchemas.notFound,
       }
    }
  },
  posts: {
    list: {
      method: 'GET' as const,
      path: '/api/communities/:slug/posts',
      responses: {
        200: z.array(z.custom<typeof posts.$inferSelect & { author: any }>()), // Simplified author type for now
        403: errorSchemas.unauthorized, // Not a member
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/communities/:id/posts',
      input: insertPostSchema.omit({ communityId: true, authorId: true }), // communityId from param, authorId from session
      responses: {
        201: z.custom<typeof posts.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/posts/:id',
      responses: {
        200: z.custom<typeof posts.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    }
  },
  comments: {
    create: {
      method: 'POST' as const,
      path: '/api/posts/:id/comments',
      input: insertCommentSchema.omit({ postId: true, authorId: true }),
      responses: {
        201: z.custom<typeof comments.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      }
    },
    list: {
       method: 'GET' as const,
       path: '/api/posts/:id/comments',
       responses: {
         200: z.array(z.custom<typeof comments.$inferSelect & { author: any }>()),
       }
    }
  },
  users: {
    me: {
      method: 'GET' as const,
      path: '/api/me/profile', // Extended profile info
      responses: {
        200: z.custom<typeof userProfiles.$inferSelect>(),
        404: z.null(), // Profile not created yet
      }
    },
    updateProfile: {
      method: 'PUT' as const,
      path: '/api/me/profile',
      input: insertUserProfileSchema.partial(),
      responses: {
        200: z.custom<typeof userProfiles.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
