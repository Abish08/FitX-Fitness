import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../AuthContext';

// Mock axios for API calls
jest.mock('axios', () => ({
  post: jest.fn(),
  get: jest.fn(),
  defaults: {
    headers: {
      common: {}
    }
  }
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Test component to interact with AuthContext
function AuthTestComponent() {
  const { user, login, logout, register, loading, error } = useAuth();
  
  const handleLogin = async () => {
    await login('test@example.com', 'password123');
  };
  
  const handleRegister = async () => {
    await register({
      email: 'new@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe'
    });
  };
  
  return (
    <div>
      <div data-testid="user-status">
        {loading && 'Loading...'}
        {error && `Error: ${error}`}
        {!loading && user && `Logged in as ${user.email}`}
        {!loading && !user && 'Not logged in'}
      </div>
      <div data-testid="user-details">
        {user && `${user.firstName} ${user.lastName}`}
      </div>
      <button onClick={handleLogin} data-testid="login-btn">
        Login
      </button>
      <button onClick={handleRegister} data-testid="register-btn">
        Register
      </button>
      <button onClick={logout} data-testid="logout-btn">
        Logout
      </button>
    </div>
  );
}

describe('AuthContext', () => {
  const axios = require('axios');
  
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  test('provides initial authentication state', () => {
    render(
      <AuthProvider>
        <AuthTestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');
  });

  test('handles successful login', async () => {
    const user = userEvent.setup();
    
    // Mock successful login response
    axios.post.mockResolvedValueOnce({
      data: {
        token: 'mock-token',
        user: {
          id: '1',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe'
        }
      }
    });
    
    render(
      <AuthProvider>
        <AuthTestComponent />
      </AuthProvider>
    );
    
    const loginButton = screen.getByTestId('login-btn');
    
    await act(async () => {
      await user.click(loginButton);
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in as test@example.com');
    });
    
    expect(screen.getByTestId('user-details')).toHaveTextContent('John Doe');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'mock-token');
  });

  test('handles login failure', async () => {
    const user = userEvent.setup();
    
    // Mock failed login response
    axios.post.mockRejectedValueOnce({
      response: {
        data: {
          message: 'Invalid credentials'
        }
      }
    });
    
    render(
      <AuthProvider>
        <AuthTestComponent />
      </AuthProvider>
    );
    
    const loginButton = screen.getByTestId('login-btn');
    
    await act(async () => {
      await user.click(loginButton);
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toHaveTextContent('Error: Invalid credentials');
    });
  });

  test('handles successful registration', async () => {
    const user = userEvent.setup();
    
    // Mock successful registration response
    axios.post.mockResolvedValueOnce({
      data: {
        token: 'new-token',
        user: {
          id: '2',
          email: 'new@example.com',
          firstName: 'John',
          lastName: 'Doe'
        }
      }
    });
    
    render(
      <AuthProvider>
        <AuthTestComponent />
      </AuthProvider>
    );
    
    const registerButton = screen.getByTestId('register-btn');
    
    await act(async () => {
      await user.click(registerButton);
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in as new@example.com');
    });
  });

  test('handles logout', async () => {
    const user = userEvent.setup();
    
    // First mock login
    axios.post.mockResolvedValueOnce({
      data: {
        token: 'mock-token',
        user: {
          id: '1',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe'
        }
      }
    });
    
    render(
      <AuthProvider>
        <AuthTestComponent />
      </AuthProvider>
    );
    
    // Login first
    const loginButton = screen.getByTestId('login-btn');
    await act(async () => {
      await user.click(loginButton);
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in as test@example.com');
    });
    
    // Then logout
    const logoutButton = screen.getByTestId('logout-btn');
    await act(async () => {
      await user.click(logoutButton);
    });
    
    expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
  });

  test('restores user from localStorage on mount', () => {
    // Mock token in localStorage
    localStorageMock.getItem.mockReturnValue('stored-token');
    
    // Mock API call to verify token
    axios.get.mockResolvedValueOnce({
      data: {
        user: {
          id: '1',
          email: 'stored@example.com',
          firstName: 'Stored',
          lastName: 'User'
        }
      }
    });
    
    render(
      <AuthProvider>
        <AuthTestComponent />
      </AuthProvider>
    );
    
    // Should attempt to restore user
    expect(axios.get).toHaveBeenCalledWith('/api/auth/me');
  });

  test('handles invalid stored token', async () => {
    // Mock token in localStorage
    localStorageMock.getItem.mockReturnValue('invalid-token');
    
    // Mock API call failure
    axios.get.mockRejectedValueOnce({
      response: { status: 401 }
    });
    
    render(
      <AuthProvider>
        <AuthTestComponent />
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');
    });
    
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
  });
});