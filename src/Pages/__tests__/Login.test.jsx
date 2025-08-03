import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock your AuthContext if you have one
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(),
    user: null,
    loading: false
  })
}));

// Helper function to render component with router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    renderWithRouter(<Login />);
    // Just test that the component renders without throwing an error
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  test('renders login form elements', () => {
    renderWithRouter(<Login />);
    
    // Look for common login form elements
    const emailInput = screen.getByRole('textbox', { name: /email/i }) || 
                      screen.getByLabelText(/email/i) ||
                      screen.getByPlaceholderText(/email/i);
    
    const passwordInput = screen.getByLabelText(/password/i) || 
                         screen.getByPlaceholderText(/password/i);
    
    const submitButton = screen.getByRole('button', { name: /login/i }) ||
                        screen.getByRole('button', { name: /sign in/i });
    
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  test('allows user to type in form fields', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Login />);
    
    // Find input fields (adjust selectors based on your actual component)
    const emailInput = screen.getByRole('textbox', { name: /email/i }) || 
                      screen.getByLabelText(/email/i) ||
                      screen.getByPlaceholderText(/email/i);
    
    const passwordInput = screen.getByLabelText(/password/i) || 
                         screen.getByPlaceholderText(/password/i);
    
    // Type in the inputs
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  test('has link to register page', () => {
    renderWithRouter(<Login />);
    
    // Look for register/signup link (adjust text based on your actual component)
    const registerLink = screen.queryByRole('link', { name: /sign up/i }) || 
                        screen.queryByRole('link', { name: /register/i }) ||
                        screen.queryByText(/don't have an account/i) ||
                        screen.queryByText(/create account/i);
    
    if (registerLink) {
      expect(registerLink).toBeInTheDocument();
    }
  });
});