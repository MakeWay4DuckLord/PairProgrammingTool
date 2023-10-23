// src/CreateSession.test.js
import {React} from 'react';
import { render } from '@testing-library/react';
import CreateSession from '../../src/components/CreateSession';
import '@testing-library/jest-dom';
import { shallow, configure } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';

configure({adapter: new Adapter()});

/**
 * Preconditions for testing: WebSocket server must be running
*/

describe('CreateSession', () => {
  test('renders with the ID User1000', () => {
    const {getByText } = render(<CreateSession userId={'User1000'} />);
    expect(getByText('User1000')).toBeInTheDocument();
  });

  test('renders with one input field', () => {
    const createSession = shallow(<CreateSession userId={'User1000'} />);
    expect(createSession.find('input').length).toBe(1);
  });
});

