// src/App.test.js
import React from 'react';
import { render } from '@testing-library/react';
import App from '../src/App.js';

describe('App', () => {
  test('renders the CreateSession component', () => {
    const { getByText } = render(<App />);
    const createSessionText = getByText('Create Session');
    
    // Check if the text "Create Session" is present, which is part of the CreateSession component
    expect(createSessionText).toBeInTheDocument();
  });
});

