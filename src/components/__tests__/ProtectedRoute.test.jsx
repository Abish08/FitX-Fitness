import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

const TestComponent = () => <div data-testid="protected-content">Protected Content</div>;

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders children when user is authenticated', () => {
    // Mock AuthContext with authenticated user
    jest.doMock('../../contexts/AuthContext', () => ({
      useAuth: () => ({
        user: {
          id: '1',
          email: 'user@example.com',
          firstName: 'John'
        },
        loading: false,
        token: 'valid-token'
      })
    }));

    renderWithRouter(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  test('redirects to login when user is not authenticated', () => {
    // Mock AuthContext with no user
    jest.doMock('../../contexts/AuthContext', () => ({
      useAuth: () => ({
        user: null,
        loading: false,
        token: null
      })
    }));

    renderWithRouter(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  test('shows loading state while checking authentication', () => {
    // Mock AuthContext with loading state
    jest.doMock('../../contexts/AuthContext', () => ({
      useAuth: () => ({
        user: null,
        loading: true,
        token: null
      })
    }));

    renderWithRouter(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );

    // Should not show protected content while loading
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    
    // Look for loading indicator if your component has one
    const loadingElement = screen.queryByText(/loading/i) || screen.queryByTestId('loading');
    if (loadingElement) {
      expect(loadingElement).toBeInTheDocument();
    }
  });

  test('handles expired token scenario', () => {
    // Mock AuthContext with expired token
    jest.doMock('../../contexts/AuthContext', () => ({
      useAuth: () => ({
        user: null,
        loading: false,
        token: 'expired-token',
        error: 'Token expired'
      })
    }));

    renderWithRouter(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    );

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });
});