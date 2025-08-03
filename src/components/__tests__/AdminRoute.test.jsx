import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminRoute from '../AdminRoute';

// Mock useNavigate
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

// Test component to use inside AdminRoute
const TestComponent = () => <div data-testid="protected-content">Admin Content</div>;

describe('AdminRoute Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders children when user is admin', () => {
    // Mock AuthContext to return admin user
    jest.doMock('../../contexts/AuthContext', () => ({
      useAuth: () => ({
        user: {
          id: '1',
          email: 'admin@example.com',
          role: 'admin',
          isAdmin: true
        },
        loading: false
      })
    }));

    renderWithRouter(
      <AdminRoute>
        <TestComponent />
      </AdminRoute>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  test('redirects when user is not admin', () => {
    // Mock AuthContext to return regular user
    jest.doMock('../../contexts/AuthContext', () => ({
      useAuth: () => ({
        user: {
          id: '1',
          email: 'user@example.com',
          role: 'user',
          isAdmin: false
        },
        loading: false
      })
    }));

    renderWithRouter(
      <AdminRoute>
        <TestComponent />
      </AdminRoute>
    );

    // Should redirect, so protected content should not be visible
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  test('shows loading state while authentication is loading', () => {
    // Mock AuthContext with loading state
    jest.doMock('../../contexts/AuthContext', () => ({
      useAuth: () => ({
        user: null,
        loading: true
      })
    }));

    renderWithRouter(
      <AdminRoute>
        <TestComponent />
      </AdminRoute>
    );

    // Should show loading or not show protected content
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  test('redirects when user is not authenticated', () => {
    // Mock AuthContext with no user
    jest.doMock('../../contexts/AuthContext', () => ({
      useAuth: () => ({
        user: null,
        loading: false
      })
    }));

    renderWithRouter(
      <AdminRoute>
        <TestComponent />
      </AdminRoute>
    );

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });
});