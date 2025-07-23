import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock fetch for API testing
const mockFetch = vi.mocked(fetch);

describe('API Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  it('should make correct API request for plant creation', async () => {
    const mockResponse = new Response(JSON.stringify({
      id: 1,
      type: 'cactus',
      genus: 'Trichocereus',
      species: null,
      commonName: 'San Pedro',
      userId: 'test-user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }), {
      status: 201,
      headers: { 'content-type': 'application/json' },
    });

    mockFetch.mockResolvedValue(mockResponse);

    // Simulate apiRequest function from queryClient
    const apiRequest = async (method: string, url: string, data: any) => {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`${response.status}: ${error}`);
      }

      return response.json();
    };

    const plantData = {
      type: 'cactus',
      genus: 'Trichocereus',
      species: null,
      cultivar: null,
      mutation: null,
      commonName: 'San Pedro',
      supplier: null,
      acquisitionDate: null,
      groundType: null,
      notes: null,
      customId: null,
    };

    const result = await apiRequest('POST', '/api/plants', plantData);

    expect(mockFetch).toHaveBeenCalledWith('/api/plants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(plantData),
      credentials: 'include',
    });

    expect(result.id).toBe(1);
    expect(result.type).toBe('cactus');
    expect(result.genus).toBe('Trichocereus');
  });

  it('should handle 401 unauthorized error', async () => {
    const mockResponse = new Response(JSON.stringify({
      message: 'Unauthorized'
    }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });

    mockFetch.mockResolvedValue(mockResponse);

    const apiRequest = async (method: string, url: string, data: any) => {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`${response.status}: ${error}`);
      }

      return response.json();
    };

    const plantData = {
      type: 'cactus',
      genus: 'Trichocereus',
    };

    await expect(apiRequest('POST', '/api/plants', plantData)).rejects.toThrow('401:');
  });
});