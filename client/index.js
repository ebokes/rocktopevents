var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  blogPosts: () => blogPosts,
  contactMessages: () => contactMessages,
  galleryItems: () => galleryItems,
  insertBlogPostSchema: () => insertBlogPostSchema,
  insertContactMessageSchema: () => insertContactMessageSchema,
  insertGalleryItemSchema: () => insertGalleryItemSchema,
  insertQuoteRequestSchema: () => insertQuoteRequestSchema,
  insertServiceSchema: () => insertServiceSchema,
  insertVenueSchema: () => insertVenueSchema,
  quoteRequests: () => quoteRequests,
  services: () => services,
  sessions: () => sessions,
  users: () => users,
  venues: () => venues
});
import { sql } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var quoteRequests = pgTable("quote_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  eventType: varchar("event_type").notNull(),
  guestCount: varchar("guest_count").notNull(),
  eventDate: timestamp("event_date").notNull(),
  budget: varchar("budget").notNull(),
  venue: text("venue"),
  services: jsonb("services").notNull(),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone").notNull(),
  contactMethod: varchar("contact_method").default("email"),
  details: text("details"),
  status: varchar("status").default("pending"),
  estimatedCost: decimal("estimated_cost", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone"),
  subject: varchar("subject").notNull(),
  message: text("message").notNull(),
  status: varchar("status").default("unread"),
  createdAt: timestamp("created_at").defaultNow()
});
var blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  slug: varchar("slug").unique().notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: varchar("category").notNull(),
  tags: text("tags").array(),
  featuredImage: varchar("featured_image"),
  published: boolean("published").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var galleryItems = pgTable("gallery_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  imageUrl: varchar("image_url").notNull(),
  category: varchar("category").notNull(),
  eventType: varchar("event_type"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var venues = pgTable("venues", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  address: text("address").notNull(),
  city: varchar("city").notNull(),
  state: varchar("state").notNull(),
  zipCode: varchar("zip_code").notNull(),
  capacity: integer("capacity").notNull(),
  pricePerDay: decimal("price_per_day", { precision: 10, scale: 2 }).notNull(),
  suitableFor: text("suitable_for").array(),
  amenities: text("amenities").array(),
  images: text("images").array(),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0.0"),
  reviewCount: integer("review_count").default(0),
  available: boolean("available").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  features: text("features").array().notNull().default(sql`'{}'`),
  color: varchar("color").notNull().default("primary"),
  icon: varchar("icon").notNull().default("Calendar"),
  imageUrl: varchar("image_url"),
  active: boolean("active").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertQuoteRequestSchema = createInsertSchema(quoteRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertContactMessageSchema = createInsertSchema(
  contactMessages
).omit({
  id: true,
  createdAt: true
});
var insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertGalleryItemSchema = createInsertSchema(galleryItems).omit({
  id: true,
  createdAt: true
});
var insertVenueSchema = createInsertSchema(venues).omit({
  id: true,
  createdAt: true
});
var insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// server/db.ts
import "dotenv/config";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, desc, like, and, sql as sql2 } from "drizzle-orm";
var DatabaseStorage = class {
  // User operations
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async upsertUser(userData) {
    const [user] = await db.insert(users).values(userData).onConflictDoUpdate({
      target: users.id,
      set: {
        ...userData,
        updatedAt: /* @__PURE__ */ new Date()
      }
    }).returning();
    return user;
  }
  // Quote operations
  async createQuoteRequest(quote) {
    const [quoteRequest] = await db.insert(quoteRequests).values(quote).returning();
    return quoteRequest;
  }
  async getQuoteRequests() {
    return await db.select().from(quoteRequests).orderBy(desc(quoteRequests.createdAt));
  }
  async getQuoteRequest(id) {
    const [quote] = await db.select().from(quoteRequests).where(eq(quoteRequests.id, id));
    return quote;
  }
  async updateQuoteRequestStatus(id, status, estimatedCost) {
    const [quote] = await db.update(quoteRequests).set({
      status,
      estimatedCost,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(quoteRequests.id, id)).returning();
    return quote;
  }
  // Contact operations
  async createContactMessage(message) {
    const [contactMessage] = await db.insert(contactMessages).values(message).returning();
    return contactMessage;
  }
  async getContactMessages() {
    return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }
  async updateContactMessageStatus(id, status) {
    const [message] = await db.update(contactMessages).set({ status }).where(eq(contactMessages.id, id)).returning();
    return message;
  }
  async deleteContactMessage(id) {
    await db.delete(contactMessages).where(eq(contactMessages.id, id));
  }
  // Blog operations
  async createBlogPost(post) {
    const [blogPost] = await db.insert(blogPosts).values(post).returning();
    return blogPost;
  }
  async getBlogPosts(published) {
    const query = db.select().from(blogPosts);
    if (published !== void 0) {
      query.where(eq(blogPosts.published, published));
    }
    return await query.orderBy(desc(blogPosts.createdAt));
  }
  async getBlogPost(slug) {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }
  async updateBlogPost(id, post) {
    const [blogPost] = await db.update(blogPosts).set({ ...post, updatedAt: /* @__PURE__ */ new Date() }).where(eq(blogPosts.id, id)).returning();
    return blogPost;
  }
  async deleteBlogPost(id) {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }
  // Gallery operations
  async createGalleryItem(item) {
    const [galleryItem] = await db.insert(galleryItems).values(item).returning();
    return galleryItem;
  }
  async getGalleryItems(category) {
    const query = db.select().from(galleryItems);
    if (category && category !== "all") {
      query.where(eq(galleryItems.category, category));
    }
    return await query.orderBy(desc(galleryItems.createdAt));
  }
  async deleteGalleryItem(id) {
    await db.delete(galleryItems).where(eq(galleryItems.id, id));
  }
  // Venue operations
  async createVenue(venue) {
    const [newVenue] = await db.insert(venues).values(venue).returning();
    return newVenue;
  }
  async getVenues(filters) {
    const conditions = [eq(venues.available, true)];
    if (filters?.city) {
      conditions.push(like(venues.city, `%${filters.city}%`));
    }
    if (filters?.capacity) {
      const capacityRanges = {
        "1-50": [1, 50],
        "51-100": [51, 100],
        "101-200": [101, 200],
        "201-500": [201, 500],
        "500+": [500, 99999]
      };
      const range = capacityRanges[filters.capacity];
      if (range) {
        conditions.push(sql2`${venues.capacity} >= ${range[0]}`);
        conditions.push(sql2`${venues.capacity} <= ${range[1]}`);
      }
    }
    if (filters?.eventType) {
      conditions.push(like(venues.suitableFor, `%${filters.eventType}%`));
    }
    return await db.select().from(venues).where(and(...conditions)).orderBy(desc(venues.rating));
  }
  async getVenue(id) {
    const [venue] = await db.select().from(venues).where(eq(venues.id, id));
    return venue;
  }
  async updateVenue(id, venue) {
    const [updatedVenue] = await db.update(venues).set(venue).where(eq(venues.id, id)).returning();
    return updatedVenue;
  }
  async deleteVenue(id) {
    await db.delete(venues).where(eq(venues.id, id));
  }
  // Service operations
  async createService(service) {
    const [newService] = await db.insert(services).values(service).returning();
    return newService;
  }
  async getServices(activeOnly = false) {
    const conditions = [];
    if (activeOnly) {
      conditions.push(eq(services.active, true));
    }
    return await db.select().from(services).where(and(...conditions)).orderBy(services.displayOrder, services.title);
  }
  async getService(id) {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  }
  async updateService(id, service) {
    const [updatedService] = await db.update(services).set({ ...service, updatedAt: /* @__PURE__ */ new Date() }).where(eq(services.id, id)).returning();
    return updatedService;
  }
  async deleteService(id) {
    await db.delete(services).where(eq(services.id, id));
  }
};
var storage = new DatabaseStorage();

// server/adminAuth.ts
import session from "express-session";
import jwt from "jsonwebtoken";
var ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USER,
  password: process.env.ADMIN_PASSWORD
};
function setupAdminAuth(app2) {
  app2.use(
    session({
      secret: process.env.SESSION_SECRET || "default-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        // Set to true in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        // Required for cross-origin in production
        maxAge: 24 * 60 * 60 * 1e3
        // 24 hours
      }
    })
  );
  app2.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      const token = jwt.sign(
        { username, role: "admin" },
        process.env.JWT_SECRET || "default-secret",
        { expiresIn: "1h" }
      );
      req.session.isAdmin = true;
      req.session.username = username;
      res.json({
        success: true,
        token,
        user: { username, role: "admin" }
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }
  });
  app2.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ message: "Failed to logout" });
      } else {
        res.json({ success: true });
      }
    });
  });
  app2.get("/api/admin/user", requireJWTAuth, (req, res) => {
    const user = req.user;
    res.json({
      username: user.username,
      role: user.role
    });
  });
}
function requireJWTAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token is required" });
  }
  jwt.verify(
    token,
    process.env.JWT_SECRET || "default-secret",
    (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }
      req.user = decoded;
      next();
    }
  );
}

// server/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
var upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1 * 1024 * 1024
    // 1MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  }
});
async function uploadToCloudinary(buffer, folder = "eventpilot") {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        folder,
        transformation: [
          { width: 1200, height: 800, crop: "limit" },
          { quality: "auto:good" },
          { format: "auto" }
        ]
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            url: result.secure_url,
            public_id: result.public_id
          });
        } else {
          reject(new Error("Upload failed"));
        }
      }
    ).end(buffer);
  });
}

// server/routes.ts
import { z } from "zod";
import cors from "cors";

// server/env.ts
function getConfig() {
  return {
    isProduction: process.env.NODE_ENV === "production",
    port: parseInt(process.env.PORT || "5000", 10),
    allowedOrigins: (process.env.ALLOWED_ORIGIN || "").split(",").filter(Boolean),
    hostFrontend: process.env.HOST_FRONTEND === "true"
  };
}

// server/corsOptions.ts
var corsOptions = {
  origin: (origin, callback) => {
    const { allowedOrigins } = getConfig();
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      if (process.env.NODE_ENV === "production") {
        const originDomain = new URL(origin).hostname;
        const isDomainAllowed = allowedOrigins.some((allowedOrigin) => {
          try {
            const allowedDomain = new URL(allowedOrigin).hostname;
            return originDomain === allowedDomain;
          } catch {
            return false;
          }
        });
        if (isDomainAllowed) {
          return callback(null, true);
        }
      }
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
  // For legacy browser support
};

// server/routes.ts
async function registerRoutes(app2) {
  setupAdminAuth(app2);
  console.log(corsOptions.origin);
  console.log(app2.options);
  app2.options("/api/admin/login", cors(corsOptions));
  app2.options("/api/admin/logout", cors(corsOptions));
  app2.options("/api/admin/user", cors(corsOptions));
  app2.get("/health", (_req, res) => res.send("ok"));
  app2.post(
    "/api/upload",
    requireJWTAuth,
    upload.single("image"),
    async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "No image file provided" });
        }
        const { folder = "eventpilot" } = req.body;
        const result = await uploadToCloudinary(req.file.buffer, folder);
        res.json({
          success: true,
          url: result.url,
          public_id: result.public_id
        });
      } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({
          success: false,
          message: "Failed to upload image",
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }
  );
  app2.post("/api/quotes", async (req, res) => {
    try {
      const validatedData = insertQuoteRequestSchema.parse(req.body);
      const quote = await storage.createQuoteRequest(validatedData);
      res.json(quote);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        console.error("Error creating quote request:", error);
        res.status(500).json({ message: "Failed to create quote request" });
      }
    }
  });
  app2.get("/api/quotes", requireJWTAuth, async (req, res) => {
    try {
      const quotes = await storage.getQuoteRequests();
      res.json(quotes);
    } catch (error) {
      console.error("Error fetching quotes:", error);
      res.status(500).json({ message: "Failed to fetch quotes" });
    }
  });
  app2.get("/api/quotes/:id", requireJWTAuth, async (req, res) => {
    try {
      const quote = await storage.getQuoteRequest(req.params.id);
      if (!quote) {
        return res.status(404).json({ message: "Quote not found" });
      }
      res.json(quote);
    } catch (error) {
      console.error("Error fetching quote:", error);
      res.status(500).json({ message: "Failed to fetch quote" });
    }
  });
  app2.patch("/api/quotes/:id/status", requireJWTAuth, async (req, res) => {
    try {
      const { status, estimatedCost } = req.body;
      const quote = await storage.updateQuoteRequestStatus(
        req.params.id,
        status,
        estimatedCost
      );
      res.json(quote);
    } catch (error) {
      console.error("Error updating quote status:", error);
      res.status(500).json({ message: "Failed to update quote status" });
    }
  });
  app2.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        console.error("Error creating contact message:", error);
        res.status(500).json({ message: "Failed to send message" });
      }
    }
  });
  app2.get("/api/contact", requireJWTAuth, async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });
  app2.delete("/api/contact/:id", requireJWTAuth, async (req, res) => {
    try {
      await storage.deleteContactMessage(req.params.id);
      res.json({ message: "Contact item deleted successfully" });
    } catch (error) {
      console.error("Error deleting contact item:", error);
      res.status(500).json({ message: "Failed to delete contact item" });
    }
  });
  app2.patch("/api/contact/:id/status", requireJWTAuth, async (req, res) => {
    try {
      const { status } = req.body;
      const message = await storage.updateContactMessageStatus(
        req.params.id,
        status
      );
      res.json(message);
    } catch (error) {
      console.error("Error updating message status:", error);
      res.status(500).json({ message: "Failed to update message status" });
    }
  });
  app2.get("/api/blog", async (req, res) => {
    try {
      const published = req.query.published === "false" ? false : true;
      const posts = await storage.getBlogPosts(published);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });
  app2.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });
  app2.post("/api/blog", requireJWTAuth, async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        console.error("Error creating blog post:", error);
        res.status(500).json({ message: "Failed to create blog post" });
      }
    }
  });
  app2.put("/api/blog/:id", requireJWTAuth, async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(req.params.id, validatedData);
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        console.error("Error updating blog post:", error);
        res.status(500).json({ message: "Failed to update blog post" });
      }
    }
  });
  app2.delete("/api/blog/:id", requireJWTAuth, async (req, res) => {
    try {
      await storage.deleteBlogPost(req.params.id);
      res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });
  app2.get("/api/gallery", async (req, res) => {
    try {
      const category = req.query.category;
      const items = await storage.getGalleryItems(category);
      res.json(items);
    } catch (error) {
      console.error("Error fetching gallery items:", error);
      res.status(500).json({ message: "Failed to fetch gallery items" });
    }
  });
  app2.post("/api/gallery", requireJWTAuth, async (req, res) => {
    try {
      const validatedData = insertGalleryItemSchema.parse(req.body);
      const item = await storage.createGalleryItem(validatedData);
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        console.error("Error creating gallery item:", error);
        res.status(500).json({ message: "Failed to create gallery item" });
      }
    }
  });
  app2.delete("/api/gallery/:id", requireJWTAuth, async (req, res) => {
    try {
      await storage.deleteGalleryItem(req.params.id);
      res.json({ message: "Gallery item deleted successfully" });
    } catch (error) {
      console.error("Error deleting gallery item:", error);
      res.status(500).json({ message: "Failed to delete gallery item" });
    }
  });
  app2.get("/api/venues", async (req, res) => {
    try {
      const filters = {
        city: req.query.city,
        capacity: req.query.capacity,
        eventType: req.query.eventType
      };
      const venues2 = await storage.getVenues(filters);
      res.json(venues2);
    } catch (error) {
      console.error("Error fetching venues:", error);
      res.status(500).json({ message: "Failed to fetch venues" });
    }
  });
  app2.get("/api/venues/:id", async (req, res) => {
    try {
      const venue = await storage.getVenue(req.params.id);
      if (!venue) {
        return res.status(404).json({ message: "Venue not found" });
      }
      res.json(venue);
    } catch (error) {
      console.error("Error fetching venue:", error);
      res.status(500).json({ message: "Failed to fetch venue" });
    }
  });
  app2.post("/api/venues", requireJWTAuth, async (req, res) => {
    try {
      const validatedData = insertVenueSchema.parse(req.body);
      const venue = await storage.createVenue(validatedData);
      res.json(venue);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        console.error("Error creating venue:", error);
        res.status(500).json({ message: "Failed to create venue" });
      }
    }
  });
  app2.put("/api/venues/:id", requireJWTAuth, async (req, res) => {
    try {
      const validatedData = insertVenueSchema.partial().parse(req.body);
      const venue = await storage.updateVenue(req.params.id, validatedData);
      res.json(venue);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        console.error("Error updating venue:", error);
        res.status(500).json({ message: "Failed to update venue" });
      }
    }
  });
  app2.delete("/api/venues/:id", requireJWTAuth, async (req, res) => {
    try {
      await storage.deleteVenue(req.params.id);
      res.json({ message: "Venue deleted successfully" });
    } catch (error) {
      console.error("Error deleting venue:", error);
      res.status(500).json({ message: "Failed to delete venue" });
    }
  });
  app2.get("/api/services", async (req, res) => {
    try {
      const activeOnly = req.query.active === "true";
      const services2 = await storage.getServices(activeOnly);
      res.json(services2);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });
  app2.post("/api/services", requireJWTAuth, async (req, res) => {
    try {
      const validatedData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(validatedData);
      res.json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        console.error("Error creating service:", error);
        res.status(500).json({ message: "Failed to create service" });
      }
    }
  });
  app2.put("/api/services/:id", requireJWTAuth, async (req, res) => {
    try {
      const validatedData = insertServiceSchema.partial().parse(req.body);
      const service = await storage.updateService(req.params.id, validatedData);
      res.json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        console.error("Error updating service:", error);
        res.status(500).json({ message: "Failed to update service" });
      }
    }
  });
  app2.delete("/api/services/:id", requireJWTAuth, async (req, res) => {
    try {
      await storage.deleteService(req.params.id);
      res.json({ message: "Service deleted successfully" });
    } catch (error) {
      console.error("Error deleting service:", error);
      res.status(500).json({ message: "Failed to delete service" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { nanoid } from "nanoid";
import { fileURLToPath } from "url";
var viteLogger = createLogger();
var __filename = fileURLToPath(import.meta.url);
var __dirname2 = path.dirname(__filename);
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
    root: path.join(__dirname2, "..", "client"),
    configFile: path.join(__dirname2, "..", "vite.config.ts"),
    // Explicit config path
    resolve: {
      alias: {
        // Mirror the alias from vite.config.ts
        "/src": path.join(__dirname2, "..", "client", "src")
      }
    }
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}

// server/index.ts
import cors2 from "cors";

// server/serveStatic.ts
import path2 from "path";
import express from "express";
function serveStatic(app2) {
  const config = getConfig();
  const staticPath = config.isProduction ? path2.join(__dirname, "..", "dist") : path2.join(__dirname, "..", "client");
  app2.use(express.static(staticPath));
  app2.get("*", (req, res) => {
    res.sendFile(path2.join(staticPath, "index.html"));
  });
}

// server/index.ts
import { fileURLToPath as fileURLToPath2 } from "url";
import path3 from "path";
import fs2 from "fs";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname3 = path3.dirname(__filename2);
if (process.env.NODE_ENV === "development") {
  const clientPath = path3.join(__dirname3, "..", "client");
  const distPath = path3.join(__dirname3, "..", "dist");
  try {
    if (!fs2.existsSync(clientPath)) {
      console.error("\u274C Client directory not found:", clientPath);
      process.exit(1);
    }
    if (!fs2.existsSync(distPath)) {
      fs2.symlinkSync(clientPath, distPath, "dir");
      console.log("\u2705 Created development symlink: dist \u2192 client");
    } else {
      const realPath = fs2.realpathSync(distPath);
      if (realPath !== clientPath) {
        fs2.rmSync(distPath, { recursive: true, force: true });
        fs2.symlinkSync(clientPath, distPath, "dir");
        console.log("\u2705 Recreated development symlink: dist \u2192 client");
      }
    }
    const mainEntry = path3.join(clientPath, "src", "main.tsx");
    if (!fs2.existsSync(mainEntry)) {
      console.error("\u274C Main entry file not found:", mainEntry);
      process.exit(1);
    }
  } catch (err) {
    console.error("\u274C Error creating symlink:", err);
    process.exit(1);
  }
}
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.get("/health", (_req, res) => res.send("ok"));
app.use(cors2(corsOptions));
app.use((req, res, next) => {
  res.on("finish", () => {
    if (req.method === "OPTIONS") {
      log(`CORS Preflight: ${req.headers.origin} -> ${res.statusCode}`);
    }
  });
  next();
});
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
var isProduction = process.env.NODE_ENV === "production";
var shouldServeStatic = isProduction && process.env.HOST_FRONTEND === "true";
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else if (shouldServeStatic) {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(
    {
      port,
      // host: "localhost",
      host: "0.0.0.0",
      reusePort: true
    },
    () => {
      log(`serving on port ${port}`);
    }
  );
})();
