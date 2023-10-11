// src/CreateSession.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CreateSession from '../../src/components/CreateSession';

// Mock the random-words generate function to return a predictable value
jest.mock('random-words', () => ({
  generate: jest.fn(() => 'mocked-word'),
}));

describe('CreateSession', () => {
  test('renders with a default user ID and input field', () => {
    render(<CreateSession />);
    
    // Check if the component renders with a default user ID
    expect(screen.getByText('Your User ID: mocked-word-mocked-word')).toBeInTheDocument();

    // Check if the input field is present
    expect(screen.getByPlaceholderText("Enter Partner's ID")).toBeInTheDocument();
  });

  test('updates partnerId when typing in the input field', () => {
    render(<CreateSession />);

    // Find the input field
    const inputField = screen.getByPlaceholderText("Enter Partner's ID");

    // Type some text into the input field
    fireEvent.change(inputField, { target: { value: 'partner123' } });

    // Check if the input field value has been updated
    expect(inputField).toHaveValue('partner123');
  });
});
