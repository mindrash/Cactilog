import { describe, it, expect } from 'vitest';
import { cactusGenera, succulentGenera, getSpeciesForGenus } from '../shared/cactus-data';

describe('Cactus Data', () => {
  it('should have valid cactus genera structure', () => {
    expect(cactusGenera).toBeDefined();
    expect(Array.isArray(cactusGenera)).toBe(true);
    expect(cactusGenera.length).toBeGreaterThan(0);
    
    cactusGenera.forEach(genus => {
      expect(genus).toHaveProperty('name');
      expect(genus).toHaveProperty('species');
      expect(typeof genus.name).toBe('string');
      expect(genus.name.length).toBeGreaterThan(0);
      expect(Array.isArray(genus.species)).toBe(true);
    });
  });

  it('should have valid succulent genera structure', () => {
    expect(succulentGenera).toBeDefined();
    expect(Array.isArray(succulentGenera)).toBe(true);
    expect(succulentGenera.length).toBeGreaterThan(0);
    
    succulentGenera.forEach(genus => {
      expect(genus).toHaveProperty('name');
      expect(genus).toHaveProperty('species');
      expect(typeof genus.name).toBe('string');
      expect(genus.name.length).toBeGreaterThan(0);
      expect(Array.isArray(genus.species)).toBe(true);
    });
  });

  it('should have no empty string species', () => {
    const allGenera = [...cactusGenera, ...succulentGenera];
    
    allGenera.forEach(genus => {
      genus.species.forEach(species => {
        expect(species).toBeTruthy();
        expect(typeof species).toBe('string');
        expect(species.trim().length).toBeGreaterThan(0);
      });
    });
  });

  it('should return species for valid genus', () => {
    const trichocereusSpecies = getSpeciesForGenus('Trichocereus', false);
    expect(Array.isArray(trichocereusSpecies)).toBe(true);
    expect(trichocereusSpecies.length).toBeGreaterThan(0);
    expect(trichocereusSpecies).toContain('pachanoi');
  });

  it('should return empty array for invalid genus', () => {
    const invalidSpecies = getSpeciesForGenus('NonExistentGenus', false);
    expect(Array.isArray(invalidSpecies)).toBe(true);
    expect(invalidSpecies.length).toBe(0);
  });

  it('should filter out empty species', () => {
    const allGenera = [...cactusGenera, ...succulentGenera];
    
    allGenera.forEach(genus => {
      const species = getSpeciesForGenus(genus.name, succulentGenera.includes(genus));
      species.forEach(species => {
        expect(species).toBeTruthy();
        expect(species.trim()).not.toBe('');
      });
    });
  });

  it('should have Trichocereus with San Pedro species', () => {
    const trichocereus = cactusGenera.find(g => g.name === 'Trichocereus');
    expect(trichocereus).toBeDefined();
    expect(trichocereus?.commonName).toBe('San Pedro');
    expect(trichocereus?.species).toContain('pachanoi');
    expect(trichocereus?.species).toContain('peruvianus');
    expect(trichocereus?.species).toContain('bridgesii');
  });
});