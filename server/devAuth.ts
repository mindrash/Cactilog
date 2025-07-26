import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: sessionTtl,
      sameSite: 'lax',
    },
  });
}

// Development authentication - creates a test user for development purposes
async function createTestUser() {
  const testUser = {
    id: 'dev_user_123',
    email: 'test@cactilog.dev',
    firstName: 'Test',
    lastName: 'User',
    profileImageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    authProvider: 'development' as const,
  };

  await storage.upsertUser(testUser);
  return testUser;
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user: any, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Development login route - automatically logs in a test user
  app.get('/api/auth/dev-login', async (req, res) => {
    try {
      const testUser = await createTestUser();
      req.login(testUser, (err) => {
        if (err) {
          console.error('Dev login error:', err);
          return res.status(500).json({ error: 'Login failed' });
        }
        res.redirect('/');
      });
    } catch (error) {
      console.error('Dev login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  });

  // OAuth provider routes with helpful messages
  app.get('/api/auth/google', (req, res) => {
    res.status(501).json({ 
      message: 'Google authentication not configured. OAuth credentials needed.',
      devLogin: '/api/auth/dev-login'
    });
  });

  app.get('/api/auth/facebook', (req, res) => {
    res.status(501).json({ 
      message: 'Facebook authentication not configured. OAuth credentials needed.',
      devLogin: '/api/auth/dev-login'
    });
  });

  app.get('/api/auth/twitter', (req, res) => {
    res.status(501).json({ 
      message: 'Twitter authentication not configured. OAuth credentials needed.',
      devLogin: '/api/auth/dev-login'
    });
  });

  app.get('/api/auth/github', (req, res) => {
    res.status(501).json({ 
      message: 'GitHub authentication not configured. OAuth credentials needed.',
      devLogin: '/api/auth/dev-login'
    });
  });

  app.get('/api/auth/microsoft', (req, res) => {
    res.status(501).json({ 
      message: 'Microsoft authentication not configured. OAuth credentials needed.',
      devLogin: '/api/auth/dev-login'
    });
  });

  // Apple placeholder
  app.get('/api/auth/apple', (req, res) => {
    res.status(501).json({ message: 'Apple authentication coming soon' });
  });

  // Logout route
  app.get('/api/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error('Logout error:', err);
      }
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destruction error:', err);
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
      });
    });
  });

  // User info route
  app.get('/api/auth/user', (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.json(req.user);
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};