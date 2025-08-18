import path from "path";
import express from "express";
import { getConfig } from "./env";

export function serveStatic(app: express.Application) {
  const config = getConfig();
  const staticPath = config.isProduction
    ? path.join(__dirname, "..", "dist")
    : path.join(__dirname, "..", "client");

  app.use(express.static(staticPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
}
