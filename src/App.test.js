import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the ETO Lechon storefront', () => {
  render(<App />);
  expect(screen.getByText(/Eto Na Ang Lechon na Hinahanap Mo/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Order Now/i })).toBeInTheDocument();
});
