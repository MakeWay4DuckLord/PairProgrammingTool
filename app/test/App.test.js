// src/App.test.js
import {React} from 'react';
import { render } from '@testing-library/react';
import App from '.././src/App';
import Waiting from '.././src/components/Waiting';
import '@testing-library/jest-dom';
import { shallow, configure } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';

configure({adapter: new Adapter()});

/**
 * Preconditions for testing: WebSocket server must be running
*/

describe('App', () => {
  test('renders waiting for permissions', () => {
    const { getByText } = render(<App />);
    expect(getByText('Waiting for permissions...')).toBeInTheDocument();
  });

  test('renders waiting component', () => {
    const app = shallow(<App />);
    expect(app.contains(<Waiting />)).toBe(true);
  });
});

