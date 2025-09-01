import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

async function verifyGoogleToken(token: string) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
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

  // Google Sign-In endpoint
  app.post('/api/auth/google', async (req, res) => {
    try {
      const { credential } = req.body;
      
      if (!credential) {
        return res.status(400).json({ error: 'No credential provided' });
      }

      const payload = await verifyGoogleToken(credential);
      if (!payload) {
        return res.status(400).json({ error: 'Invalid token' });
      }

      // Check if user exists by email first
      const existingUser = await storage.getUserByEmail(payload.email || '');
      
      let user;
      if (existingUser) {
        // Update existing user with Google info
        const updateData = {
          firstName: payload.given_name || existingUser.firstName,
          lastName: payload.family_name || existingUser.lastName,
          profileImageUrl: payload.picture || existingUser.profileImageUrl,
          authProvider: 'google' as const,
        };
        user = await storage.updateUser(existingUser.id, updateData);
      } else {
        // Create new user
        const userData = {
          id: `google_${payload.sub}`,
          email: payload.email || '',
          firstName: payload.given_name || '',
          lastName: payload.family_name || '',
          profileImageUrl: payload.picture || '',
          authProvider: 'google' as const,
          contributePhotosToKnowledgeBase: true,
        };
        user = await storage.upsertUser(userData);
      }

      // Log the user in
      req.login(user!, (err) => {
        if (err) {
          console.error('Login error:', err);
          return res.status(500).json({ error: 'Login failed' });
        }
        res.json({ success: true, user });
      });

    } catch (error) {
      console.error('Google auth error:', error);
      res.status(500).json({ error: 'Authentication failed' });
    }
  });

  // Logout route
  app.post('/api/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error('Logout error:', err);
      }
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destruction error:', err);
        }
        res.clearCookie('connect.sid');
        res.json({ success: true });
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

  // Generic login route that redirects to Google OAuth
  app.get('/api/login', (req, res) => {
    // For now, redirect to the frontend with a message to use Google Sign-In
    // In the future, this could redirect directly to Google OAuth
    res.redirect('/?login=true');
  });

  // Config endpoint for frontend
  app.get('/api/auth/config', (req, res) => {
    res.json({
      googleClientId: process.env.GOOGLE_CLIENT_ID || '',
    });
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};