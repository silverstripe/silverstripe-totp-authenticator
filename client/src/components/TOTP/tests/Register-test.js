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

const TOTPVerifyComponent = () => <div />;

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
          TOTPVerifyComponent={TOTPVerifyComponent}
        />
      );

      wrapper.instance().handleBack();
      expect(onBackMock.mock.calls.length).toBe(1);
    });
  });

  describe('renderErrorScreen()', () => {
    it('renders the provided errors', () => {
      const wrapper = shallow(
        <Register
          onBack={onBackMock}
          onCompleteRegistration={onCompleteRegistrationMock}
          method={mockMethod}
          code="FOO123"
          uri="example"
          errors={['Something went wrong', 'I am a unit test']}
          TOTPVerifyComponent={TOTPVerifyComponent}
        />
      );

      expect(wrapper.text()).toContain('Something went wrong');
      expect(wrapper.text()).toContain('I am a unit test');
    });
  });

  describe('handleBackToScan()', () => {
    it('clears errors when clicking on the back button', () => {
      const wrapper = shallow(
        <Register
          onBack={onBackMock}
          onCompleteRegistration={onCompleteRegistrationMock}
          method={mockMethod}
          code="FOO123"
          uri="example"
          TOTPVerifyComponent={TOTPVerifyComponent}
        />
      );

      wrapper.setState({ error: 'Something went wrong' });
      wrapper.instance().handleBackToScan();
      expect(wrapper.instance().state.view).toBe('SCAN_CODE');
      expect(wrapper.instance().state.error).toBeNull();
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
          TOTPVerifyComponent={TOTPVerifyComponent}
        />
      );

      expect(wrapper.find('.mfa-action-list .btn').first()).toHaveLength(1);
      expect(wrapper.find('.mfa-action-list .btn').at(1)).toHaveLength(1);
    });

    it('goes back to the previous screen from the initial screen when clicking "Back"', () => {
      const wrapper = shallow(
        <Register
          onBack={onBackMock}
          onCompleteRegistration={onCompleteRegistrationMock}
          method={mockMethod}
          code="FOO123"
          uri="example"
          TOTPVerifyComponent={TOTPVerifyComponent}
        />
      );

      wrapper.find('.mfa-action-list .btn').at(1).simulate('click');
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
          TOTPVerifyComponent={TOTPVerifyComponent}
        />
      );

      wrapper.find('.mfa-action-list .btn').first().simulate('click');
      expect(wrapper.find(TOTPVerifyComponent)).toHaveLength(1);
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
          TOTPVerifyComponent={TOTPVerifyComponent}
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
          TOTPVerifyComponent={TOTPVerifyComponent}
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
          TOTPVerifyComponent={TOTPVerifyComponent}
        />
      );

      expect(wrapper.text()).toContain('How to use authenticator app');
    });
  });
});
