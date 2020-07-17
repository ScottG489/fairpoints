import React from 'react';
import { render } from '@testing-library/react';
import App from '../components/App';

test('app renders', () => {
  const { getByText } = render(<App />);
});
