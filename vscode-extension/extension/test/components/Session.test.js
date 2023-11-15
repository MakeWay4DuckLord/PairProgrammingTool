import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Session from '../../src/app/components/Session';

// Mock the PiChart and Accordion components
jest.mock('../../src/app/components/PiChart', () => ({ subject, subject1, subject2, metric, val1, val2 }) => (
  <div data-testid="mocked-pi-chart">
    <span>{subject}</span>
    <span>{subject1}</span>
    <span>{subject2}</span>
    <span>{metric}</span>
    <span>{val1}</span>
    <span>{val2}</span>
  </div>
));

jest.mock('../../src/app/components/Accordion', () => ({ title, content }) => (
  <div data-testid="mocked-accordion">
    <span>{title}</span>
    <div>{content}</div>
  </div>
));

describe('Session Component', () => {
  it('renders Session component with correct elements', () => {
    render(<Session onSwitch={() => {}} />);

    expect(screen.getByText('Your Collaboration Metrics')).toBeInTheDocument();
    expect(screen.getByTestId('mocked-pi-chart')).toBeInTheDocument();
    expect(screen.getByText('End Session')).toBeInTheDocument();
  });

  it('calls onSwitch prop when the "End Session" button is clicked', () => {
    const mockOnSwitch = jest.fn();
    render(<Session onSwitch={mockOnSwitch} />);

    // Click the "End Session" button
    fireEvent.click(screen.getByText('End Session'));

    // Check if the onSwitch function is called
    expect(mockOnSwitch).toHaveBeenCalledWith('end');
  });
});
