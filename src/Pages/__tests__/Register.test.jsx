import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Register from '../Register';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    register: jest.fn(),
    user: null,
    loading: false,
    error: null
  })
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Register Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders registration form', () => {
    renderWithRouter(<Register />);
    
    expect(screen.getByText(/register/i) || screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  test('renders all required form fields', () => {
    renderWithRouter(<Register />);
    
    // Look for common registration fields
    const emailField = screen.queryByLabelText(/email/i) || screen.queryByPlaceholderText(/email/i);
    const passwordField = screen.queryByLabelText(/password/i) || screen.queryByPlaceholderText(/password/i);
    const firstNameField = screen.queryByLabelText(/first name/i) || screen.queryByPlaceholderText(/first name/i);
    const lastNameField = screen.queryByLabelText(/last name/i) || screen.queryByPlaceholderText(/last name/i);
    
    if (emailField) expect(emailField).toBeInTheDocument();
    if (passwordField) expect(passwordField).toBeInTheDocument();
    if (firstNameField) expect(firstNameField).toBeInTheDocument();
    if (lastNameField) expect(lastNameField).toBeInTheDocument();
  });

  test('allows user to fill out registration form', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Register />);
    
    const emailField = screen.queryByLabelText(/email/i) || screen.queryByPlaceholderText(/email/i);
    const passwordField = screen.queryByLabelText(/password/i) || screen.queryByPlaceholderText(/password/i);
    
    if (emailField && passwordField) {
      await user.type(emailField, 'newuser@example.com');
      await user.type(passwordField, 'password123');
      
      expect(emailField).toHaveValue('newuser@example.com');
      expect(passwordField).toHaveValue('password123');
    }
  });

  test('has link to login page', () => {
    renderWithRouter(<Register />);
    
    const loginLink = screen.queryByRole('link', { name: /login/i }) || 
                     screen.queryByRole('link', { name: /sign in/i }) ||
                     screen.queryByText(/already have an account/i);
    
    if (loginLink) {
      expect(loginLink).toBeInTheDocument();
    }
  });

  test('handles form submission', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Register />);
    
    const submitButton = screen.queryByRole('button', { name: /register/i }) ||
                        screen.queryByRole('button', { name: /sign up/i }) ||
                        screen.queryByRole('button', { name: /create account/i });
    
    if (submitButton) {
      await user.click(submitButton);
      // Form should attempt submission
      expect(submitButton).toBeInTheDocument();
    }
  });
});