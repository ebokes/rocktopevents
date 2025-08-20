import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAdminAuth, requireAdmin } from "./adminAuth";
import {
  insertQuoteRequestSchema,
  insertContactMessageSchema,
  insertBlogPostSchema,
  insertGalleryItemSchema,
  insertVenueSchema,
  insertServiceSchema,
} from "@shared/schema";
import { z } from "zod";
import cors from "cors";
import { corsOptions } from "./corsOptions";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup admin authentication
  setupAdminAuth(app);

  console.log(corsOptions.origin);
  console.log(app.options);

  // Add this before your other routes
  // app.options("*", cors(corsOptions)); // Handle preflight requests

  // Also add OPTIONS handling for specific auth routes
  app.options("/api/admin/login", cors(corsOptions));
  app.options("/api/admin/logout", cors(corsOptions));
  app.options("/api/admin/user", cors(corsOptions));

  app.get("/health", (_req, res) => res.send("ok"));

  // Quote request routes
  app.post("/api/quotes", async (req, res) => {
    try {
      const validatedData = insertQuoteRequestSchema.parse(req.body);
      const quote = await storage.createQuoteRequest(validatedData);
      res.json(quote);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ message: "Validation error", errors: error.errors });
      } else {
        console.error("Error creating quote request:", error);
        res.status(500).json({ message: "Failed to create quote request" });
      }
    }
  });

  app.get("/api/quotes", requireAdmin, async (req, res) => {
    try {
      const quotes = await storage.getQuoteRequests();
      res.json(quotes);
    } catch (error) {
      console.error("Error fetching quotes:", error);
      res.status(500).json({ message: "Failed to fetch quotes" });
    }
  });

  app.get("/api/quotes/:id", requireAdmin, async (req, res) => {
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

  app.patch("/api/quotes/:id/status", requireAdmin, async (req, res) => {
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

  // Contact message routes
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ message: "Validation error", errors: error.errors });
      } else {
        console.error("Error creating contact message:", error);
        res.status(500).json({ message: "Failed to send message" });
      }
    }
  });

  app.get("/api/contact", requireAdmin, async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.patch("/api/contact/:id/status", requireAdmin, async (req, res) => {
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

  // Blog routes
  app.get("/api/blog", async (req, res) => {
    try {
      const published = req.query.published === "false" ? false : true;
      const posts = await storage.getBlogPosts(published);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
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

  app.post("/api/blog", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedData);
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ message: "Validation error", errors: error.errors });
      } else {
        console.error("Error creating blog post:", error);
        res.status(500).json({ message: "Failed to create blog post" });
      }
    }
  });

  app.put("/api/blog/:id", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(req.params.id, validatedData);
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ message: "Validation error", errors: error.errors });
      } else {
        console.error("Error updating blog post:", error);
        res.status(500).json({ message: "Failed to update blog post" });
      }
    }
  });

  app.delete("/api/blog/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteBlogPost(req.params.id);
      res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // Gallery routes
  app.get("/api/gallery", async (req, res) => {
    try {
      const category = req.query.category as string;
      const items = await storage.getGalleryItems(category);
      res.json(items);
    } catch (error) {
      console.error("Error fetching gallery items:", error);
      res.status(500).json({ message: "Failed to fetch gallery items" });
    }
  });

  app.post("/api/gallery", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertGalleryItemSchema.parse(req.body);
      const item = await storage.createGalleryItem(validatedData);
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ message: "Validation error", errors: error.errors });
      } else {
        console.error("Error creating gallery item:", error);
        res.status(500).json({ message: "Failed to create gallery item" });
      }
    }
  });

  app.delete("/api/gallery/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteGalleryItem(req.params.id);
      res.json({ message: "Gallery item deleted successfully" });
    } catch (error) {
      console.error("Error deleting gallery item:", error);
      res.status(500).json({ message: "Failed to delete gallery item" });
    }
  });

  // Venue routes
  app.get("/api/venues", async (req, res) => {
    try {
      const filters = {
        city: req.query.city as string,
        capacity: req.query.capacity as string,
        eventType: req.query.eventType as string,
      };
      const venues = await storage.getVenues(filters);
      res.json(venues);
    } catch (error) {
      console.error("Error fetching venues:", error);
      res.status(500).json({ message: "Failed to fetch venues" });
    }
  });

  app.get("/api/venues/:id", async (req, res) => {
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

  app.post("/api/venues", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertVenueSchema.parse(req.body);
      const venue = await storage.createVenue(validatedData);
      res.json(venue);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ message: "Validation error", errors: error.errors });
      } else {
        console.error("Error creating venue:", error);
        res.status(500).json({ message: "Failed to create venue" });
      }
    }
  });

  app.put("/api/venues/:id", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertVenueSchema.partial().parse(req.body);
      const venue = await storage.updateVenue(req.params.id, validatedData);
      res.json(venue);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ message: "Validation error", errors: error.errors });
      } else {
        console.error("Error updating venue:", error);
        res.status(500).json({ message: "Failed to update venue" });
      }
    }
  });

  app.delete("/api/venues/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteVenue(req.params.id);
      res.json({ message: "Venue deleted successfully" });
    } catch (error) {
      console.error("Error deleting venue:", error);
      res.status(500).json({ message: "Failed to delete venue" });
    }
  });

  // Service routes
  app.get("/api/services", async (req, res) => {
    try {
      const activeOnly = req.query.active === "true";
      const services = await storage.getServices(activeOnly);
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.post("/api/services", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(validatedData);
      res.json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ message: "Validation error", errors: error.errors });
      } else {
        console.error("Error creating service:", error);
        res.status(500).json({ message: "Failed to create service" });
      }
    }
  });

  app.put("/api/services/:id", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertServiceSchema.partial().parse(req.body);
      const service = await storage.updateService(req.params.id, validatedData);
      res.json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ message: "Validation error", errors: error.errors });
      } else {
        console.error("Error updating service:", error);
        res.status(500).json({ message: "Failed to update service" });
      }
    }
  });

  app.delete("/api/services/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteService(req.params.id);
      res.json({ message: "Service deleted successfully" });
    } catch (error) {
      console.error("Error deleting service:", error);
      res.status(500).json({ message: "Failed to delete service" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
