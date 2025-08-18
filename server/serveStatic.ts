import path from "path";
import express from "express";

export function serveStatic(app: express.Application) {
  // Serve static assets from client/dist
  const staticPath = path.join(__dirname, "..", "client", "dist");
  app.use(express.static(staticPath));

  // SPA fallback: serve index.html for all non-API routes
  app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
      res.sendFile(path.join(staticPath, "index.html"));
    }
  });
}
