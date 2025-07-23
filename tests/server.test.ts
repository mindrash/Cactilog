import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { registerRoutes } from '../server/routes';
import { storage } from '../server/storage';

// Mock the storage and auth
vi.mock('../server/storage', () => ({
  storage: {
    createPlant: vi.fn(),
    getPlants: vi.fn(),
    getPlant: vi.fn(),
    updatePlant: vi.fn(),
    deletePlant: vi.fn(),
    getDashboardStats: vi.fn(),
    getGrowthRecords: vi.fn(),
    createGrowthRecord: vi.fn(),
    getUser: vi.fn(),
    upsertUser: vi.fn(),
  }
}));

// Mock auth middleware
vi.mock('../server/replitAuth', () => ({
  isAuthenticated: (req: any, res: any, next: any) => {
    req.user = { claims: { sub: 'test-user-123' } };
    next();
  },
  setupAuth: vi.fn(),
}));

describe('Plant API Endpoints', () => {
  let app: express.Application;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    await registerRoutes(app);
  });

  it('should create a plant successfully', async () => {
    const mockPlant = {
      id: 1,
      type: 'cactus',
      genus: 'Trichocereus',
      species: 'pachanoi',
      commonName: 'San Pedro',
      userId: 'test-user-123',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(storage.createPlant).mockResolvedValue(mockPlant);

    const response = await request(app)
      .post('/api/plants')
      .send({
        type: 'cactus',
        genus: 'Trichocereus',
        species: 'pachanoi',
        commonName: 'San Pedro',
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockPlant);
    expect(storage.createPlant).toHaveBeenCalledWith({
      type: 'cactus',
      genus: 'Trichocereus',
      species: 'pachanoi',
      commonName: 'San Pedro',
      userId: 'test-user-123',
    });
  });

  it('should get plants for authenticated user', async () => {
    const mockPlants = [
      {
        id: 1,
        type: 'cactus',
        genus: 'Trichocereus',
        species: 'pachanoi',
        userId: 'test-user-123',
      }
    ];

    vi.mocked(storage.getPlants).mockResolvedValue(mockPlants);

    const response = await request(app)
      .get('/api/plants');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockPlants);
    expect(storage.getPlants).toHaveBeenCalledWith('test-user-123', {
      search: undefined,
      type: undefined,
      genus: undefined,
    });
  });

  it('should return 400 for invalid plant data', async () => {
    const response = await request(app)
      .post('/api/plants')
      .send({
        // Missing required fields
        genus: 'Trichocereus',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid plant data');
  });

  it('should get dashboard stats', async () => {
    const mockStats = {
      totalPlants: 5,
      uniqueGenera: 3,
      recentAdditions: 2,
      growthRecords: 1,
    };

    vi.mocked(storage.getDashboardStats).mockResolvedValue(mockStats);

    const response = await request(app)
      .get('/api/dashboard/stats');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockStats);
  });
});