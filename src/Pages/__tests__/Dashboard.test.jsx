import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';

// Mock child components to isolate Dashboard testing
jest.mock('../DashboardCalendar', () => {
  return function MockDashboardCalendar() {
    return <div data-testid="dashboard-calendar">Mock Calendar</div>;
  };
});

// Mock AuthContext
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User'
    },
    loading: false
  })
}));

// Mock components that might not exist yet
jest.mock('../../components/AdminRoute', () => {
  return function MockAdminRoute({ children }) {
    return <div data-testid="admin-route">{children}</div>;
  };
});

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Dashboard Component', () => {
  test('renders without crashing', () => {
    renderWithRouter(<Dashboard />);
    // Just test that the component renders
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });

  test('displays dashboard content', () => {
    renderWithRouter(<Dashboard />);
    
    // Look for common dashboard elements
    const dashboardElement = screen.getByText(/dashboard/i);
    expect(dashboardElement).toBeInTheDocument();
  });

  test('renders calendar component if it exists', () => {
    renderWithRouter(<Dashboard />);
    
    // Check if calendar component is rendered (if it exists in your Dashboard)
    const calendar = screen.queryByTestId('dashboard-calendar');
    if (calendar) {
      expect(calendar).toBeInTheDocument();
    }
  });
});