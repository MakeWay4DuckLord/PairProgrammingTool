// src/CreateSession.test.js
import {React} from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CreateSession from '../../src/components/CreateSession';
import '@testing-library/jest-dom'

// Mock the random-words generate function 
// for some reason the test fails if you take this out 
jest.mock('random-words', () => ({
  generate: jest.fn(() => 'mocked-word'),
}));


describe('CreateSession', () => {
  test('renders with a default user ID and input field', () => {
    const {getByText } = render(<CreateSession />);
    
    expect(getByText('Create Session')).toBeInTheDocument();
  });

  test('updates partnerId when typing in the input field', () => {
    const {getByPlaceholderText } = render(<CreateSession />);

    // Find the input field
    const inputField = getByPlaceholderText("Enter Partner's ID");

    // Type some text into the input field
    fireEvent.change(inputField, { target: { value: 'partner123' } });

    // Check if the input field value has been updated
    expect(inputField).toHaveValue('partner123');
  });
});