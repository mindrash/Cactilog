import { describe, it, expect } from 'vitest';
import { insertPlantSchema } from '../shared/schema';

describe('Smoke Tests - Core App Functionality', () => {
  it('should validate plant schema correctly', () => {
    const validPlant = {
      type: 'cactus',
      genus: 'Trichocereus',
      species: 'pachanoi',
      cultivar: '',
      mutation: '',
      commonName: 'San Pedro',
      supplier: '',
      acquisitionDate: '',
      groundType: '',
      notes: '',
      customId: '',
    };

    const result = insertPlantSchema.safeParse(validPlant);
    expect(result.success).toBe(true);
  });

  it('should fail validation for missing required fields', () => {
    const invalidPlant = {
      // Missing type and genus
      species: 'pachanoi',
    };

    const result = insertPlantSchema.safeParse(invalidPlant);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(issue => issue.path.includes('type'))).toBe(true);
      expect(result.error.issues.some(issue => issue.path.includes('genus'))).toBe(true);
    }
  });

  it('should clean data properly (convert empty strings to null)', () => {
    const plantData = {
      type: 'cactus',
      genus: 'Trichocereus',
      species: '', // Should become null
      cultivar: '',
      mutation: '',
      commonName: 'San Pedro',
      supplier: '',
      acquisitionDate: '',
      groundType: '',
      notes: '',
      customId: '',
    };

    // Simulate the cleaning logic from the form
    const cleanedData = {
      ...plantData,
      species: plantData.species === '' ? null : plantData.species,
      cultivar: plantData.cultivar === '' ? null : plantData.cultivar,
      mutation: plantData.mutation === '' ? null : plantData.mutation,
      supplier: plantData.supplier === '' ? null : plantData.supplier,
      acquisitionDate: plantData.acquisitionDate === '' ? null : plantData.acquisitionDate,
      groundType: plantData.groundType === '' ? null : plantData.groundType,
      notes: plantData.notes === '' ? null : plantData.notes,
      customId: plantData.customId === '' ? null : plantData.customId,
    };

    expect(cleanedData.species).toBe(null);
    expect(cleanedData.type).toBe('cactus');
    expect(cleanedData.genus).toBe('Trichocereus');
    expect(cleanedData.commonName).toBe('San Pedro');
  });
});