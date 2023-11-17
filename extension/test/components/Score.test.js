import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Score from '../../src/app/components/Score';

describe('Score Component', () => {
  it('renders Score component with correct class based on the number', () => {
    // Test case 1: Small score (<= 3.33)
    render(<Score number={3} />);
    const smallScoreElement = screen.getByText('3');
    expect(smallScoreElement).toBeInTheDocument();
    expect(smallScoreElement).toHaveClass('score', 'small');

    // Test case 2: Medium score (> 3.33 and <= 6.66)
    render(<Score number={5} />);
    const mediumScoreElement = screen.getByText('5');
    expect(mediumScoreElement).toBeInTheDocument();
    expect(mediumScoreElement).toHaveClass('score', 'medium');

    // Test case 3: Large score (> 6.66)
    render(<Score number={8} />);
    const largeScoreElement = screen.getByText('8');
    expect(largeScoreElement).toBeInTheDocument();
    expect(largeScoreElement).toHaveClass('score', 'large');
  });
});
