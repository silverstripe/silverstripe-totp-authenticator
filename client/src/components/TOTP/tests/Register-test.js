/* global jest, describe, it, expect */

jest.mock('lib/Injector');

import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Component as Register } from '../Register';

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

const TOTPLoginComponent = () => <div />;

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
          TOTPLoginComponent={TOTPLoginComponent}
        />
      );

      wrapper.instance().handleBack();
      expect(onBackMock.mock.calls.length).toBe(1);
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
          TOTPLoginComponent={TOTPLoginComponent}
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
          TOTPLoginComponent={TOTPLoginComponent}
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
          TOTPLoginComponent={TOTPLoginComponent}
        />
      );

      wrapper.find('.mfa-actions__action--next').simulate('click');
      expect(wrapper.find(TOTPLoginComponent)).toHaveLength(1);
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
          TOTPLoginComponent={TOTPLoginComponent}
        />
      );

      expect(wrapper.find('QRCode')).toHaveLength(1);
    });
  });

  describe('renderSupportLink()', () => {
    it('renders nothing when no support link is defined in the method', () => {
      const wrapper = shallow(
        <Register
          onBack={onBackMock}
          onCompleteRegistration={onCompleteRegistrationMock}
          method={{
            urlSegment: 'totp',
            name: 'TOTP',
          }}
          code="FOO123"
          uri="example"
          TOTPLoginComponent={TOTPLoginComponent}
        />
      );

      expect(wrapper.text()).not.toContain('How to use authenticator app');
    });

    it('renders a support link for the provided method on both screens', () => {
      const wrapper = shallow(
        <Register
          onBack={onBackMock}
          onCompleteRegistration={onCompleteRegistrationMock}
          method={mockMethod}
          code="FOO123"
          uri="example"
          TOTPLoginComponent={TOTPLoginComponent}
        />
      );

      expect(wrapper.text()).toContain('How to use authenticator app');
    });
  });
});
