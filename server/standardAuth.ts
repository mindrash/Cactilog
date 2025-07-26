import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as TwitterStrategy } from "passport-twitter";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as MicrosoftStrategy } from "passport-microsoft";
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

async function upsertUser(profile: any, provider: string) {
  const email = profile.emails?.[0]?.value || null;
  const firstName = profile.name?.givenName || profile.displayName?.split(' ')[0] || null;
  const lastName = profile.name?.familyName || profile.displayName?.split(' ').slice(1).join(' ') || null;
  const profileImageUrl = profile.photos?.[0]?.value || null;

  await storage.upsertUser({
    id: `${provider}_${profile.id}`,
    email,
    firstName,
    lastName,
    profileImageUrl,
    authProvider: provider,
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Google OAuth Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
      scope: ['profile', 'email']
    }, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      try {
        await upsertUser(profile, 'google');
        const user = await storage.getUser(`google_${profile.id}`);
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }));
  } else {
    console.log('Google OAuth not configured - skipping strategy registration');
  }

  // Facebook OAuth Strategy
  if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/api/auth/facebook/callback",
      profileFields: ['id', 'displayName', 'photos', 'email', 'name']
    }, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      try {
        await upsertUser(profile, 'facebook');
        const user = await storage.getUser(`facebook_${profile.id}`);
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }));
  }

  // Twitter OAuth Strategy
  if (process.env.TWITTER_CONSUMER_KEY && process.env.TWITTER_CONSUMER_SECRET) {
    passport.use(new TwitterStrategy({
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: "/api/auth/twitter/callback",
      includeEmail: true
    }, async (token: string, tokenSecret: string, profile: any, done: any) => {
      try {
        await upsertUser(profile, 'twitter');
        const user = await storage.getUser(`twitter_${profile.id}`);
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }));
  }

  // GitHub OAuth Strategy
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/api/auth/github/callback",
      scope: ['user:email']
    }, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      try {
        await upsertUser(profile, 'github');
        const user = await storage.getUser(`github_${profile.id}`);
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }));
  }

  // Microsoft OAuth Strategy
  if (process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET) {
    passport.use(new MicrosoftStrategy({
      clientID: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      callbackURL: "/api/auth/microsoft/callback",
      scope: ['user.read']
    }, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      try {
        await upsertUser(profile, 'microsoft');
        const user = await storage.getUser(`microsoft_${profile.id}`);
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }));
  }

  // Note: Apple OAuth requires more complex setup with JWT tokens
  // For now, we'll provide a placeholder that shows "Coming Soon" in the UI

  passport.serializeUser((user: any, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Authentication routes for each provider
  
  // Google
  app.get('/api/auth/google', (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return res.status(501).json({ message: 'Google authentication not configured. Please contact the administrator to set up OAuth credentials.' });
    }
    passport.authenticate('google')(req, res, next);
  });
  app.get('/api/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => res.redirect('/')
  );

  // Facebook
  app.get('/api/auth/facebook', (req, res, next) => {
    if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) {
      return res.status(501).json({ message: 'Facebook authentication not configured. Please contact the administrator to set up OAuth credentials.' });
    }
    passport.authenticate('facebook')(req, res, next);
  });
  app.get('/api/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    (req, res) => res.redirect('/')
  );

  // Twitter
  app.get('/api/auth/twitter', (req, res, next) => {
    if (!process.env.TWITTER_CONSUMER_KEY || !process.env.TWITTER_CONSUMER_SECRET) {
      return res.status(501).json({ message: 'Twitter authentication not configured. Please contact the administrator to set up OAuth credentials.' });
    }
    passport.authenticate('twitter')(req, res, next);
  });
  app.get('/api/auth/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: '/' }),
    (req, res) => res.redirect('/')
  );

  // GitHub
  app.get('/api/auth/github', (req, res, next) => {
    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
      return res.status(501).json({ message: 'GitHub authentication not configured. Please contact the administrator to set up OAuth credentials.' });
    }
    passport.authenticate('github')(req, res, next);
  });
  app.get('/api/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => res.redirect('/')
  );

  // Microsoft
  app.get('/api/auth/microsoft', (req, res, next) => {
    if (!process.env.MICROSOFT_CLIENT_ID || !process.env.MICROSOFT_CLIENT_SECRET) {
      return res.status(501).json({ message: 'Microsoft authentication not configured. Please contact the administrator to set up OAuth credentials.' });
    }
    passport.authenticate('microsoft')(req, res, next);
  });
  app.get('/api/auth/microsoft/callback',
    passport.authenticate('microsoft', { failureRedirect: '/' }),
    (req, res) => res.redirect('/')
  );

  // Apple (placeholder - shows coming soon in UI)
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