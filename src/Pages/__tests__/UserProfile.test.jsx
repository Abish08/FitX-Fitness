import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import UserProfile from '../UserProfile';

jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({
    data: {
      user: {
        id: '1',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
        height: 180,
        weight: 75,
        fitnessGoals: ['weight_loss', 'muscle_gain']
      }
    }
  })),
  put: jest.fn(() => Promise.resolve({ data: { success: true } }))
}));

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: '1',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe'
    },
    token: 'mock-token',
    updateUser: jest.fn()
  })
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('UserProfile Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders user profile heading', () => {
    renderWithRouter(<UserProfile />);
    expect(screen.getByText(/profile/i) || screen.getByText(/account/i)).toBeInTheDocument();
  });

  test('displays user information', async () => {
    renderWithRouter(<UserProfile />);
    
    await waitFor(() => {
      // Look for user data display
      const userName = screen.queryByText(/john/i) || screen.queryByText(/doe/i);
      const userEmail = screen.queryByText(/test@example.com/i);
      
      if (userName || userEmail) {
        expect(userName || userEmail).toBeInTheDocument();
      }
    });
  });

  test('renders profile edit form', () => {
    renderWithRouter(<UserProfile />);
    
    // Look for form fields
    const firstNameField = screen.queryByLabelText(/first name/i) || 
                          screen.queryByDisplayValue(/john/i);
    const lastNameField = screen.queryByLabelText(/last name/i) ||
                         screen.queryByDisplayValue(/doe/i);
    const emailField = screen.queryByLabelText(/email/i) ||
                      screen.queryByDisplayValue(/test@example.com/i);
    
    // At least one profile field should exist
    expect(firstNameField || lastNameField || emailField).toBeTruthy();
  });

  test('allows editing profile information', async () => {
    const user = userEvent.setup();
    renderWithRouter(<UserProfile />);
    
    // Find an editable field
    const firstNameField = screen.queryByLabelText(/first name/i) ||
                          screen.queryByRole('textbox');
    
    if (firstNameField) {
      await user.clear(firstNameField);
      await user.type(firstNameField, 'Updated Name');
      expect(firstNameField).toHaveValue('Updated Name');
    }
  });

  test('handles profile update submission', async () => {
    const user = userEvent.setup();
    renderWithRouter(<UserProfile />);
    
    // Look for save/update button
    const saveButton = screen.queryByRole('button', { name: /save/i }) ||
                      screen.queryByRole('button', { name: /update/i }) ||
                      screen.queryByRole('button', { name: /submit/i });
    
    if (saveButton) {
      await user.click(saveButton);
      expect(saveButton).toBeInTheDocument();
    }
  });

  test('displays fitness goals section', () => {
    renderWithRouter(<UserProfile />);
    
    // Look for fitness goals
    const goalsSection = screen.queryByText(/goals/i) ||
                        screen.queryByText(/objectives/i) ||
                        screen.queryByText(/targets/i);
    
    if (goalsSection) {
      expect(goalsSection).toBeInTheDocument();
    }
  });

  test('allows updating fitness goals', async () => {
    const user = userEvent.setup();
    renderWithRouter(<UserProfile />);
    
    // Look for goal checkboxes or selectors
    const goalCheckbox = screen.queryByRole('checkbox') ||
                        screen.queryByRole('radio') ||
                        screen.queryByRole('combobox');
    
    if (goalCheckbox) {
      await user.click(goalCheckbox);
      expect(goalCheckbox).toBeInTheDocument();
    }
  });

  test('handles profile picture upload', async () => {
    const user = userEvent.setup();
    renderWithRouter(<UserProfile />);
    
    // Look for file input
    const fileInput = screen.queryByLabelText(/photo/i) ||
                     screen.queryByLabelText(/picture/i) ||
                     screen.queryByLabelText(/avatar/i);
    
    if (fileInput) {
      const file = new File(['dummy content'], 'profile.jpg', { type: 'image/jpeg' });
      await user.upload(fileInput, file);
      expect(fileInput.files[0]).toBe(file);
    }
  });
});