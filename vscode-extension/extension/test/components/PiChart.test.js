import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PiChart from '../../src/app/components/PiChart';

// Mock the react-google-charts library
jest.mock('react-google-charts', () => ({ Chart: ({ data }) => <div data-testid="mocked-chart">{JSON.stringify(data)}</div> }));

describe('PiChart Component', () => {
  it('renders PiChart component with correct data', () => {
    const subject = 'Subject';
    const metric = 'Metric';
    const subject1 = 'Subject1';
    const subject2 = 'Subject2';
    const val1 = 10;
    const val2 = 20;
    const title = 'Chart Title';

    render(
      <PiChart
        subject={subject}
        metric={metric}
        subject1={subject1}
        subject2={subject2}
        val1={val1}
        val2={val2}
        title={title}
      />
    );

    // Check if the mocked chart component is rendered
    const mockedChart = screen.getByTestId('mocked-chart');
    expect(mockedChart).toBeInTheDocument();

    // Parse the mocked chart data and check if it contains the expected values
    const parsedData = JSON.parse(mockedChart.textContent);
    expect(parsedData).toEqual([[subject, metric], [subject1, val1], [subject2, val2]]);
  });
});
