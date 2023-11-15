import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Accordion from '../../src/app/components/Accordion';

describe('Accordion Component', () => {
  test('renders accordion with title and content', () => {
    const title = 'Test Title';
    const content = 'Test Content';

    const { getByText } = render(<Accordion title={title} content={content} />);

    // Assert that the title and content are rendered
    expect(getByText(title)).toBeInTheDocument();
    expect(getByText(content)).toBeInTheDocument();
  });

});
