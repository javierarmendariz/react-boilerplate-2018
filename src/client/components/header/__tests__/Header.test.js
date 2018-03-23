import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Header from '../Header';

Enzyme.configure({ adapter: new Adapter() });

describe('Header (component)', () => {
  it('has at least one <h1> tag', () => {
    const wrapper = shallow(<Header />);
    expect(wrapper.contains(<h1>Header!</h1>)).toBe(true);
  })
});
