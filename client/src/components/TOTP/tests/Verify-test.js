/* global jest, describe, it, expect */

import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Verify from '../Verify';

Enzyme.configure({ adapter: new Adapter() });

window.ss = {
  i18n: {
    inject: (string) => string,
    _t: (key, string) => string
  },
};

const mockMethod = {
  urlSegment: 'totp',
  name: 'TOTP',
  description: 'Verify using TOTP',
  supportLink: 'https://google.com',
  component: 'TOTPVerify',
  thumbnail: 'totp.svg',
};

const onCompleteVerificationMock = jest.fn();

describe('Verify', () => {
  beforeEach(() => {
    onCompleteVerificationMock.mockReset();
  });

  describe('canSubmit()', () => {
    it('returns false when code is not 6 chars', () => {
      const wrapper = shallow(
        <Verify
          onCompleteVerification={onCompleteVerificationMock}
          method={mockMethod}
        />
      );

      wrapper.instance().setState({ code: '12345' });
      expect(wrapper.instance().canSubmit()).toBe(false);
    });

    it('returns true when code is 6 chars', () => {
      const wrapper = shallow(
        <Verify
          onCompleteVerification={onCompleteVerificationMock}
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
        <Verify
          onCompleteVerification={onCompleteVerificationMock}
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
        <Verify
          onCompleteVerification={onCompleteVerificationMock}
          method={mockMethod}
        />
      );

      wrapper.instance().setState({ code: '123456' });
      wrapper.find('.mfa-totp__code').simulate('keyup', { keyCode: 13 });
      expect(onCompleteVerificationMock.mock.calls).toHaveLength(1);
    });

    it('does nothing when code is not valid', () => {
      const wrapper = shallow(
        <Verify
          onCompleteVerification={onCompleteVerificationMock}
          method={mockMethod}
        />
      );

      wrapper.instance().setState({ code: 'ABC' });
      wrapper.find('.mfa-totp__code').simulate('keyup', { keyCode: 13 });
      expect(onCompleteVerificationMock.mock.calls).toHaveLength(0);
    });
  });

  describe('handleSubmit()', () => {
    it('calls the onCompleteVerification prop and passes the code', () => {
      const wrapper = shallow(
        <Verify
          onCompleteVerification={onCompleteVerificationMock}
          method={mockMethod}
        />
      );

      wrapper.instance().handleChangeCode({ target: { value: 'FOO468' } });
      wrapper.instance().handleSubmit();
      expect(onCompleteVerificationMock.mock.calls.length).toBe(1);
      expect(onCompleteVerificationMock.mock.calls[0][0]).toEqual({ code: 'FOO468' });
    });
  });

  describe('renderActionsMenu()', () => {
    it('disables the "Next" button on code validation unless you have entered 6 characters', () => {
      const wrapper = shallow(
        <Verify
          onCompleteVerification={onCompleteVerificationMock}
          method={mockMethod}
        />
      );

      wrapper.instance().setState({ code: '' });
      expect(wrapper.find('.mfa-action-list .btn').first().props().disabled).toBe(true);

      wrapper.instance().setState({ code: 'FOO' });
      expect(wrapper.find('.mfa-action-list .btn').first().props().disabled).toBe(true);

      wrapper.instance().setState({ code: 'FOO123' });
      expect(wrapper.find('.mfa-action-list .btn').first().props().disabled).toBe(false);
    });
  });

  describe('renderSupportLink()', () => {
    it('renders nothing when no support link is defined in the method', () => {
      const wrapper = shallow(
        <Verify
          onCompleteVerification={onCompleteVerificationMock}
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
        <Verify
          onCompleteVerification={onCompleteVerificationMock}
          method={mockMethod}
        />
      );

      expect(wrapper.text()).toContain('How to use authenticator app');
    });
  });

  describe('renderVerifyForm()', () => {
    it('renders an input for the code', () => {
      const wrapper = shallow(
        <Verify
          onCompleteVerification={onCompleteVerificationMock}
          method={mockMethod}
        />
      );

      expect(wrapper.find('.mfa-totp__code')).toHaveLength(1);
    });

    it('identifies errors when passed', () => {
      const wrapper = shallow(
        <Verify
          error="Something went wrong"
          onCompleteVerification={onCompleteVerificationMock}
          method={mockMethod}
        />
      );

      expect(wrapper.text()).toContain('Something went wrong');
    });

    it('renders the method thumbnail', () => {
      const wrapper = shallow(
        <Verify
          onCompleteVerification={onCompleteVerificationMock}
          method={mockMethod}
        />
      );

      expect(wrapper.find('.mfa-totp__validate-img')).toHaveLength(1);
    });

    it('defaults to a 6 character code length', () => {
      const wrapper = shallow(
        <Verify
          onCompleteVerification={onCompleteVerificationMock}
          method={mockMethod}
        />
      );

      expect(wrapper.find('.mfa-totp__code').props().maxLength).toBe(6);
    });

    it('allows the code length to be configured', () => {
      const wrapper = shallow(
        <Verify
          codeLength={12}
          onCompleteVerification={onCompleteVerificationMock}
          method={mockMethod}
        />
      );

      expect(wrapper.find('.mfa-totp__code').props().maxLength).toBe(12);
    });
  });
});
