import express from "express";
import session from "express-session";
import { storage } from "./storage";

// Simple admin credentials
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'rocktop@1@2'
};

export function setupAdminAuth(app: express.Express) {
  // Setup session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'default-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Admin login route
  app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      (req.session as any).isAdmin = true;
      (req.session as any).username = username;
      res.json({ 
        success: true, 
        user: { username, role: 'admin' } 
      });
    } else {
      res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
  });

  // Admin logout route
  app.post('/api/admin/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ message: 'Failed to logout' });
      } else {
        res.json({ success: true });
      }
    });
  });

  // Check admin status route
  app.get('/api/admin/user', (req, res) => {
    if ((req.session as any)?.isAdmin) {
      res.json({ 
        username: (req.session as any).username, 
        role: 'admin' 
      });
    } else {
      res.status(401).json({ message: 'Not authenticated' });
    }
  });
}

// Middleware to protect admin routes
export function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  if ((req.session as any)?.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Admin access required' });
  }
}