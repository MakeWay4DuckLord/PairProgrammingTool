// src/App.test.js
import {React} from 'react';
import App from '.././src/App';
import { render, screen, fireEvent, act, waitFor, getByTestId, queryAllByLabelText, queryAllByRole } from '@testing-library/react';
import '@testing-library/jest-dom'

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

// mock the media stream 
describe('App component', () => {
  const mockMediaStream = {
    getTracks: () => [],
    getAudioTracks: () => [],
    getVideoTracks: () => [],
  };

  // set up the media stream 
  beforeAll(() => {
    // Define the mockGetUserMedia function
    const mockGetUserMedia = (constraints) => {
      return new Promise((resolve, reject) => {
        resolve(mockMediaStream);
      });
    };

    // Replace the real getUserMedia with your mock function
    Object.defineProperty(navigator, 'mediaDevices', {
      value: {
        getUserMedia: mockGetUserMedia,
      },
      configurable: true,
    });
  });

  test('should simulate two users pairing', async () => {
     // Render the first instance of App
     const { queryAllByText } = render(<App />);
     // Render the second instance of App
     const { container } = render(<App />);
     // Use queryAllByText to find all elements with the text "Waiting for permissions..."
     const instances = queryAllByText('Waiting for permissions...');
     // Assert that there are two instances of "Waiting for permissions..."
     expect(instances).toHaveLength(2);
  });

  test('Your test case', async () => {
  // Render the first instance of App
  const { getByTestId, getAllByText, queryAllByText, queryAllByTestId, queryAllByRole} = render(<App />);
  // Render the second instance of App
  const { container: containerB } = render(<App />);

    var id2;
    var input1;

    // wait for allow acces to media devices
    await act(async () => {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    });
    await waitFor(() => {
      const ids = queryAllByTestId('id');
      expect(id).toHaveLength(2); 
      const partnerids = queryAllByRole('textbox');
      expect(partnerids).toHaveLength(2); 

      // Use getByLabelText to get Partner A's unique ID
      id2 = ids[1].textContent;
      input1 = partnerids[0];

      fireEvent.change(input1, {
        target: { value: id2 }
      });
  
      waitFor(() => {
        // check the input field got updated should be in 2 places now
        const testChange = queryAllByText(`${id2}`);
        expect(testChange).toHaveLength(2);
      });
      
      // get the start button 
      const startButton = getAllByText('Start Session');
      expect(startButton).toHaveLength(2); 
  
      // click the start button
      fireEvent.click(startButton[0]);

      // check the video call starts 
      waitFor(() => {
        expect(getByTestId('video-call')).toBeInTheDocument();
      })

    });

  });

  afterAll(() => {
    // Restore the original getUserMedia function after your tests
    Object.defineProperty(navigator, 'mediaDevices', { value: undefined });
  });

});

