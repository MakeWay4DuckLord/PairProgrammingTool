import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios'; // You may want to mock Axios for testing
import EndSession from '../../src/app/components/EndSession';
import { it } from 'mocha';
import '@testing-library/jest-dom'

// Mocking Axios to avoid actual API calls during testing
jest.mock('axios');

// Mock isomorphic-ws
jest.mock('isomorphic-ws', () => {
  class MockWebSocket {
    constructor(url) {
      this.url = url;
      this.onopen = null;
      this.addEventListener = jest.fn();
      this.send = jest.fn();
    }
  }
  return MockWebSocket;
});

describe('EndSession Component', () => {
  test('renders the component and checks if the report is closed when the button is clicked', async () => {
    // Mocking Axios responses for the component's API calls
    axios.get.mockResolvedValueOnce({ data: { lines_of_code: [10, 20] } });
    axios.get.mockResolvedValueOnce({ data: 2 });
    axios.get.mockResolvedValueOnce({ data: [1, 2, 3] });

    // Mocking the clearSession function
    const clearSessionMock = jest.fn();

    // Render the component
    render(<EndSession onSwitch={clearSessionMock} />);

    // Wait for the component to fetch data and update
    await waitFor(() => {
      expect(screen.getByText("Today's Collaboration Score")).toBeInTheDocument();
    });

    // Check if the accordions are rendered
    expect(screen.getByText("Your communication style was")).toBeInTheDocument();
    expect(screen.getByText("You interrupted your partner")).toBeInTheDocument();
    expect(screen.getByText("Your leadership style was")).toBeInTheDocument();
    expect(screen.getByText("You displayed a")).toBeInTheDocument();

    // Click the close report button
    fireEvent.click(screen.getByText("Close Report"));

    // Check if the clearSession function is called
    expect(clearSessionMock).toHaveBeenCalled();
  });
});

