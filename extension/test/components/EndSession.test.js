import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EndSession from '../../src/app/components/EndSession';

// Mock the module that contains the Score component
jest.mock('../../src/app/components/Score', () => ({ number }) => <div data-testid="mocked-score">{number}</div>);

// Mock the module that contains the PiChart component
jest.mock('../../src/app/components/PiChart', () => () => <div data-testid="mocked-pi-chart"></div>);

// Mock the module that contains the Accordion component
jest.mock('../../src/app/components/Accordion', () => ({ title, content }) => (
  <div data-testid="mocked-accordion">
    <div data-testid="mocked-accordion-title">{title}</div>
    <div data-testid="mocked-accordion-content">{content}</div>
  </div>
));

describe('EndSession Component', () => {
  it('renders EndSession component with correct elements', () => {
    render(<EndSession onSwitch={() => {}} />);
    
    // Check if the main container is rendered
    expect(screen.getByTestId('mocked-score')).toBeInTheDocument();

    // Check if the button is rendered
    expect(screen.getByText('End Session')).toBeInTheDocument();
  });

  it('calls onSwitch prop when the "End Session" button is clicked', () => {
    const mockOnSwitch = jest.fn();
    render(<EndSession onSwitch={mockOnSwitch} />);

    // Click the "End Session" button
    fireEvent.click(screen.getByText('End Session'));

    // Check if the onSwitch function is called
    expect(mockOnSwitch).toHaveBeenCalledWith('end');
  });
});
