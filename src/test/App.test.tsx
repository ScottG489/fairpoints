import React from 'react';
import { render } from '@testing-library/react';
import App from '../components/App';
import { vi } from 'vitest';

test('app renders', () => {
  // Mock fetch to prevent actual API calls during tests
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ token: 'mock-token' }),
    })
  ) as any;

  const { getByText } = render(<App />);
});
