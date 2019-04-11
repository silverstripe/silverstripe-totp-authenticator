/* global jest, describe, it, expect */

import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Login from '../Login';

Enzyme.configure({ adapter: new Adapter() });

window.ss = {
  i18n: { _t: (key, string) => string },
};

const mockMethod = {
  urlSegment: 'totp',
  name: 'TOTP',
  description: 'Login using TOTP',
  supportLink: 'https://google.com',
  component: 'TOTPLogin',
  thumbnail: 'totp.svg',
};

const onCompleteLoginMock = jest.fn();

describe('Login', () => {
  beforeEach(() => {
    onCompleteLoginMock.mockReset();
  });

  describe('canSubmit()', () => {
    it('returns false when code is not 6 chars', () => {
      const wrapper = shallow(
        <Login
          onCompleteLogin={onCompleteLoginMock}
          method={mockMethod}
        />
      );

      wrapper.instance().setState({ code: '12345' });
      expect(wrapper.instance().canSubmit()).toBe(false);
    });

    it('returns true when code is 6 chars', () => {
      const wrapper = shallow(
        <Login
          onCompleteLogin={onCompleteLoginMock}
          method={mockMethod}
        />
      );

      wrapper.instance().setState({ code: '123456' });
      expect(wrapper.instance().canSubmit()).toBe(true);
    });
  });

  describe('handleChangeCode()', () => {
    it('updates the code in the state', () => {
      const wrapper = shallow(
        <Login
          onCompleteLogin={onCompleteLoginMock}
          method={mockMethod}
        />
      );

      wrapper.instance().handleChangeCode({ target: { value: 'foo' } });
      expect(wrapper.instance().state.code).toBe('foo');
    });
  });

  describe('handleInputKeyUp()', () => {
    it('treats enter key as a form submission when code is valid', () => {
      const wrapper = shallow(
        <Login
          onCompleteLogin={onCompleteLoginMock}
          method={mockMethod}
        />
      );

      wrapper.instance().setState({ code: '123456' });
      wrapper.find('.mfa-totp__code').simulate('keyup', { keyCode: 13 });
      expect(onCompleteLoginMock.mock.calls).toHaveLength(1);
    });

    it('does nothing when code is not valid', () => {
      const wrapper = shallow(
        <Login
          onCompleteLogin={onCompleteLoginMock}
          method={mockMethod}
        />
      );

      wrapper.instance().setState({ code: 'ABC' });
      wrapper.find('.mfa-totp__code').simulate('keyup', { keyCode: 13 });
      expect(onCompleteLoginMock.mock.calls).toHaveLength(0);
    });
  });

  describe('handleSubmit()', () => {
    it('calls the onCompleteLogin prop and passes the code', () => {
      const wrapper = shallow(
        <Login
          onCompleteLogin={onCompleteLoginMock}
          method={mockMethod}
        />
      );

      wrapper.instance().handleChangeCode({ target: { value: 'FOO468' } });
      wrapper.instance().handleSubmit();
      expect(onCompleteLoginMock.mock.calls.length).toBe(1);
      expect(onCompleteLoginMock.mock.calls[0][0]).toEqual({ code: 'FOO468' });
    });
  });

  describe('renderActionsMenu()', () => {
    it('disables the "Next" button on code validation unless you have entered 6 characters', () => {
      const wrapper = shallow(
        <Login
          onCompleteLogin={onCompleteLoginMock}
          method={mockMethod}
        />
      );

      wrapper.instance().setState({ code: '' });
      expect(wrapper.find('.mfa-actions__action--next').props().disabled).toBe(true);

      wrapper.instance().setState({ code: 'FOO' });
      expect(wrapper.find('.mfa-actions__action--next').props().disabled).toBe(true);

      wrapper.instance().setState({ code: 'FOO123' });
      expect(wrapper.find('.mfa-actions__action--next').props().disabled).toBe(false);
    });
  });

  describe('renderSupportLink()', () => {
    it('renders nothing when no support link is defined in the method', () => {
      const wrapper = shallow(
        <Login
          onCompleteLogin={onCompleteLoginMock}
          method={{
            urlSegment: 'totp',
            name: 'TOTP',
          }}
        />
      );

      expect(wrapper.text()).not.toContain('How to use authenticator app');
    });

    it('renders a support link for the provided method on both screens', () => {
      const wrapper = shallow(
        <Login
          onCompleteLogin={onCompleteLoginMock}
          method={mockMethod}
        />
      );

      expect(wrapper.text()).toContain('How to use authenticator app');
    });
  });

  describe('renderVerifyForm()', () => {
    it('renders an input for the code', () => {
      const wrapper = shallow(
        <Login
          onCompleteLogin={onCompleteLoginMock}
          method={mockMethod}
        />
      );

      expect(wrapper.find('.mfa-totp__code')).toHaveLength(1);
    });

    it('identifies errors when passed', () => {
      const wrapper = shallow(
        <Login
          error="Something went wrong"
          onCompleteLogin={onCompleteLoginMock}
          method={mockMethod}
        />
      );

      expect(wrapper.text()).toContain('Invalid code');
    });

    it('renders the method thumbnail', () => {
      const wrapper = shallow(
        <Login
          onCompleteLogin={onCompleteLoginMock}
          method={mockMethod}
        />
      );

      expect(wrapper.find('.mfa-totp__validate-img')).toHaveLength(1);
    });
  });
});
