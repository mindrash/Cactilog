import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AddPlantModal from '../client/src/components/add-plant-modal';

// Mock the API request
vi.mock('../client/src/lib/queryClient', () => ({
  apiRequest: vi.fn(),
  queryClient: new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  }),
}));

// Mock toast
vi.mock('../client/src/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock auth
vi.mock('../client/src/lib/authUtils', () => ({
  isUnauthorizedError: vi.fn(() => false),
}));

describe('AddPlantModal', () => {
  let queryClient: QueryClient;
  let user: any;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    user = userEvent.setup();
    vi.clearAllMocks();
  });

  const renderModal = (open = true) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <AddPlantModal open={open} onOpenChange={vi.fn()} />
      </QueryClientProvider>
    );
  };

  it('should render with default values', () => {
    renderModal();
    
    expect(screen.getByDisplayValue('cactus')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Trichocereus')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add plant/i })).toBeInTheDocument();
  });

  it('should have all required form fields', () => {
    renderModal();
    
    // Required fields
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/genus/i)).toBeInTheDocument();
    
    // Optional fields
    expect(screen.getByLabelText(/species/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cultivar/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/common name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/custom id/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/supplier/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/acquisition date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ground type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
  });

  it('should allow changing plant type and update genus options', async () => {
    renderModal();
    
    const typeSelect = screen.getByDisplayValue('cactus');
    await user.click(typeSelect);
    
    const succulentOption = screen.getByText('Succulent');
    await user.click(succulentOption);
    
    // Should update to show succulent genera
    await waitFor(() => {
      expect(screen.getByText(/genera available for succulents/i)).toBeInTheDocument();
    });
  });

  it('should show species options when genus is selected', async () => {
    renderModal();
    
    // Genus should be pre-selected as Trichocereus
    await waitFor(() => {
      expect(screen.getByText(/species available for Trichocereus/i)).toBeInTheDocument();
    });
  });

  it('should submit form with valid data', async () => {
    const { apiRequest } = await import('../client/src/lib/queryClient');
    vi.mocked(apiRequest).mockResolvedValue({});
    
    renderModal();
    
    // Fill in common name
    const commonNameInput = screen.getByLabelText(/common name/i);
    await user.type(commonNameInput, 'San Pedro Cactus');
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /add plant/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(apiRequest).toHaveBeenCalledWith('POST', '/api/plants', expect.objectContaining({
        type: 'cactus',
        genus: 'Trichocereus',
        commonName: 'San Pedro Cactus',
      }));
    });
  });

  it('should handle form validation errors', async () => {
    renderModal();
    
    // Clear required field
    const genusField = screen.getByDisplayValue('Trichocereus');
    await user.clear(genusField);
    
    const submitButton = screen.getByRole('button', { name: /add plant/i });
    await user.click(submitButton);
    
    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument();
    });
  });
});