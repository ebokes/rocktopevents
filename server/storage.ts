import {
  users,
  quoteRequests,
  contactMessages,
  blogPosts,
  galleryItems,
  venues,
  type User,
  type UpsertUser,
  type QuoteRequest,
  type InsertQuoteRequest,
  type ContactMessage,
  type InsertContactMessage,
  type BlogPost,
  type InsertBlogPost,
  type GalleryItem,
  type InsertGalleryItem,
  type Venue,
  type InsertVenue,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, like, and, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Quote operations
  createQuoteRequest(quote: InsertQuoteRequest): Promise<QuoteRequest>;
  getQuoteRequests(): Promise<QuoteRequest[]>;
  getQuoteRequest(id: string): Promise<QuoteRequest | undefined>;
  updateQuoteRequestStatus(id: string, status: string, estimatedCost?: string): Promise<QuoteRequest>;
  
  // Contact operations
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  updateContactMessageStatus(id: string, status: string): Promise<ContactMessage>;
  
  // Blog operations
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  getBlogPosts(published?: boolean): Promise<BlogPost[]>;
  getBlogPost(slug: string): Promise<BlogPost | undefined>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: string): Promise<void>;
  
  // Gallery operations
  createGalleryItem(item: InsertGalleryItem): Promise<GalleryItem>;
  getGalleryItems(category?: string): Promise<GalleryItem[]>;
  deleteGalleryItem(id: string): Promise<void>;
  
  // Venue operations
  createVenue(venue: InsertVenue): Promise<Venue>;
  getVenues(filters?: { city?: string, capacity?: string, eventType?: string }): Promise<Venue[]>;
  getVenue(id: string): Promise<Venue | undefined>;
  updateVenue(id: string, venue: Partial<InsertVenue>): Promise<Venue>;
  deleteVenue(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Quote operations
  async createQuoteRequest(quote: InsertQuoteRequest): Promise<QuoteRequest> {
    const [quoteRequest] = await db
      .insert(quoteRequests)
      .values(quote)
      .returning();
    return quoteRequest;
  }

  async getQuoteRequests(): Promise<QuoteRequest[]> {
    return await db
      .select()
      .from(quoteRequests)
      .orderBy(desc(quoteRequests.createdAt));
  }

  async getQuoteRequest(id: string): Promise<QuoteRequest | undefined> {
    const [quote] = await db
      .select()
      .from(quoteRequests)
      .where(eq(quoteRequests.id, id));
    return quote;
  }

  async updateQuoteRequestStatus(id: string, status: string, estimatedCost?: string): Promise<QuoteRequest> {
    const [quote] = await db
      .update(quoteRequests)
      .set({ 
        status, 
        estimatedCost,
        updatedAt: new Date() 
      })
      .where(eq(quoteRequests.id, id))
      .returning();
    return quote;
  }

  // Contact operations
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [contactMessage] = await db
      .insert(contactMessages)
      .values(message)
      .returning();
    return contactMessage;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt));
  }

  async updateContactMessageStatus(id: string, status: string): Promise<ContactMessage> {
    const [message] = await db
      .update(contactMessages)
      .set({ status })
      .where(eq(contactMessages.id, id))
      .returning();
    return message;
  }

  // Blog operations
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [blogPost] = await db
      .insert(blogPosts)
      .values(post)
      .returning();
    return blogPost;
  }

  async getBlogPosts(published?: boolean): Promise<BlogPost[]> {
    const query = db.select().from(blogPosts);
    
    if (published !== undefined) {
      query.where(eq(blogPosts.published, published));
    }
    
    return await query.orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPost(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug));
    return post;
  }

  async updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost> {
    const [blogPost] = await db
      .update(blogPosts)
      .set({ ...post, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return blogPost;
  }

  async deleteBlogPost(id: string): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  // Gallery operations
  async createGalleryItem(item: InsertGalleryItem): Promise<GalleryItem> {
    const [galleryItem] = await db
      .insert(galleryItems)
      .values(item)
      .returning();
    return galleryItem;
  }

  async getGalleryItems(category?: string): Promise<GalleryItem[]> {
    const query = db.select().from(galleryItems);
    
    if (category && category !== 'all') {
      query.where(eq(galleryItems.category, category));
    }
    
    return await query.orderBy(desc(galleryItems.createdAt));
  }

  async deleteGalleryItem(id: string): Promise<void> {
    await db.delete(galleryItems).where(eq(galleryItems.id, id));
  }

  // Venue operations
  async createVenue(venue: InsertVenue): Promise<Venue> {
    const [newVenue] = await db
      .insert(venues)
      .values(venue)
      .returning();
    return newVenue;
  }

  async getVenues(filters?: { city?: string, capacity?: string, eventType?: string }): Promise<Venue[]> {
    const conditions = [eq(venues.available, true)];
    
    if (filters?.city) {
      conditions.push(like(venues.city, `%${filters.city}%`));
    }
    
    if (filters?.capacity) {
      const capacityRanges: { [key: string]: [number, number] } = {
        '1-50': [1, 50],
        '51-100': [51, 100],
        '101-200': [101, 200],
        '201-500': [201, 500],
        '500+': [500, 99999],
      };
      
      const range = capacityRanges[filters.capacity];
      if (range) {
        conditions.push(sql`${venues.capacity} >= ${range[0]}`);
        conditions.push(sql`${venues.capacity} <= ${range[1]}`);
      }
    }
    
    if (filters?.eventType) {
      conditions.push(like(venues.suitableFor, `%${filters.eventType}%`));
    }
    
    return await db.select()
      .from(venues)
      .where(and(...conditions))
      .orderBy(desc(venues.rating));
  }

  async getVenue(id: string): Promise<Venue | undefined> {
    const [venue] = await db
      .select()
      .from(venues)
      .where(eq(venues.id, id));
    return venue;
  }

  async updateVenue(id: string, venue: Partial<InsertVenue>): Promise<Venue> {
    const [updatedVenue] = await db
      .update(venues)
      .set(venue)
      .where(eq(venues.id, id))
      .returning();
    return updatedVenue;
  }

  async deleteVenue(id: string): Promise<void> {
    await db.delete(venues).where(eq(venues.id, id));
  }
}

export const storage = new DatabaseStorage();
