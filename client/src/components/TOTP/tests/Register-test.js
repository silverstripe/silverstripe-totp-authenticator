/* global jest, describe, it, expect */

import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Register from '../Register';

Enzyme.configure({ adapter: new Adapter() });

window.ss = {
  i18n: { _t: (key, string) => string },
};

const mockMethod = {
  urlSegment: 'totp',
  name: 'TOTP',
  description: 'Register using TOTP',
  supportLink: 'https://google.com',
  component: 'TOTPRegister',
};

const onBackMock = jest.fn();
const onCompleteRegistrationMock = jest.fn();

describe('Register', () => {
  beforeEach(() => {
    onBackMock.mockReset();
    onCompleteRegistrationMock.mockReset();
  });

  describe('handleBack()', () => {
    it('calls the onBack prop', () => {
      const wrapper = shallow(
        <Register
          onBack={onBackMock}
          onCompleteRegistration={onCompleteRegistrationMock}
          method={mockMethod}
          code="FOO123"
          uri="example"
        />
      );

      wrapper.instance().handleBack();
      expect(onBackMock.mock.calls.length).toBe(1);
    });
  });

  describe('handleChangeCode()', () => {
    it('updates the code in the state', () => {
      const wrapper = shallow(
        <Register
          onBack={onBackMock}
          onCompleteRegistration={onCompleteRegistrationMock}
          method={mockMethod}
          code="FOO123"
          uri="example"
        />
      );

      wrapper.instance().handleChangeCode({ target: { value: 'foo' } });
      expect(wrapper.instance().state.code).toBe('foo');
    });
  });

  describe('handleSubmit()', () => {
    it('calls the onCompleteRegistration prop and passes the code', () => {
      const wrapper = shallow(
        <Register
          onBack={onBackMock}
          onCompleteRegistration={onCompleteRegistrationMock}
          method={mockMethod}
          code="FOO123"
          uri="example"
        />
      );

      wrapper.instance().handleChangeCode({ target: { value: 'FOO468' } });
      wrapper.instance().handleSubmit();
      expect(onCompleteRegistrationMock.mock.calls.length).toBe(1);
      expect(onCompleteRegistrationMock.mock.calls[0][0]).toEqual({ code: 'FOO468' });
    });
  });

  describe('renderActionsMenu()', () => {
    it('renders a "Next" and "Back" button', () => {
      const wrapper = shallow(
        <Register
          onBack={onBackMock}
          onCompleteRegistration={onCompleteRegistrationMock}
          method={mockMethod}
          code="FOO123"
          uri="example"
        />
      );

      expect(wrapper.find('.mfa-actions__action--next')).toHaveLength(1);
      expect(wrapper.find('.mfa-actions__action--back')).toHaveLength(1);
    });

    it('goes back to the previous screen from the initial screen when clicking "Back"', () => {
      const wrapper = shallow(
        <Register
          onBack={onBackMock}
          onCompleteRegistration={onCompleteRegistrationMock}
          method={mockMethod}
          code="FOO123"
          uri="example"
        />
      );

      wrapper.find('.mfa-actions__action--back').simulate('click');
      expect(onBackMock.mock.calls.length).toBe(1);
    });

    it('goes to the input validation screen when clicking "Next" on the QR code screen', () => {
      const wrapper = shallow(
        <Register
          onBack={onBackMock}
          onCompleteRegistration={onCompleteRegistrationMock}
          method={mockMethod}
          code="FOO123"
          uri="example"
        />
      );

      wrapper.find('.mfa-actions__action--next').simulate('click');
      expect(wrapper.text()).toContain('Use verification code from your authenticator app');
    });

    it('goes back to the QR code screen when clicking "Back" on input validation screen', () => {
      const wrapper = shallow(
        <Register
          onBack={onBackMock}
          onCompleteRegistration={onCompleteRegistrationMock}
          method={mockMethod}
          code="FOO123"
          uri="example"
        />
      );

      wrapper.find('.mfa-actions__action--next').simulate('click');
      wrapper.find('.mfa-actions__action--back').simulate('click');
      expect(wrapper.text()).toContain('Enter manually the following code into authentication app');
    });

    it('disables the "Next" button on code validation unless you have entered 6 characters', () => {
      const wrapper = shallow(
        <Register
          onBack={onBackMock}
          onCompleteRegistration={onCompleteRegistrationMock}
          method={mockMethod}
          code="FOO123"
          uri="example"
        />
      );
      wrapper.find('.mfa-actions__action--next').simulate('click');

      wrapper.instance().setState({ code: '' });
      expect(wrapper.find('.mfa-actions__action--next').props().disabled).toBe(true);

      wrapper.instance().setState({ code: 'FOO' });
      expect(wrapper.find('.mfa-actions__action--next').props().disabled).toBe(true);

      wrapper.instance().setState({ code: 'FOO123' });
      expect(wrapper.find('.mfa-actions__action--next').props().disabled).toBe(false);
    });
  });

  describe('renderScanCodeScreen()', () => {
    it('renders a QR code', () => {
      const wrapper = shallow(
        <Register
          onBack={onBackMock}
          onCompleteRegistration={onCompleteRegistrationMock}
          method={mockMethod}
          code="FOO123"
          uri="example"
        />
      );

      expect(wrapper.find('QRCode')).toHaveLength(1);
    });
  });

  describe('renderSupportLink()', () => {
    it('renders a support link for the provided method on both screens', () => {
      const wrapper = shallow(
        <Register
          onBack={onBackMock}
          onCompleteRegistration={onCompleteRegistrationMock}
          method={mockMethod}
          code="FOO123"
          uri="example"
        />
      );

      expect(wrapper.text()).toContain('How to use authenticator app');
      wrapper.find('.mfa-actions__action--next').simulate('click');
      expect(wrapper.text()).toContain('How to use authenticator app');
    });
  });

  describe('renderValidateCodeScreen()', () => {
    it('renders an input for the code', () => {
      const wrapper = shallow(
        <Register
          onBack={onBackMock}
          onCompleteRegistration={onCompleteRegistrationMock}
          method={mockMethod}
          code="FOO123"
          uri="example"
        />
      );

      wrapper.find('.mfa-actions__action--next').simulate('click');
      expect(wrapper.find('.mfa-register-totp__code')).toHaveLength(1);
    });
  });
});
