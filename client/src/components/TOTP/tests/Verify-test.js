/* global jest, test, expect */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Verify from '../Verify';

window.ss = {
  i18n: {
    inject: (string) => string,
    _t: (key, string) => string
  },
};

function makeProps(obj = {}) {
  return {
    method: {
      urlSegment: 'totp',
      name: 'TOTP',
      description: 'Verify using TOTP',
      supportLink: 'https://google.com',
      component: 'TOTPVerify',
      thumbnail: 'totp.svg',
    },
    onCompleteVerification: () => null,
    ...obj
  };
}

test('Verify canSubmit() returns false when code in not 6 chars', async () => {
  render(
    <Verify {...makeProps()}/>
  );
  const input = await screen.findByLabelText('Enter {length}-digit code');
  fireEvent.change(input, { target: { value: '12345' } });
  const next = await screen.findByText('Next');
  expect(next.hasAttribute('disabled')).toBe(true);
});

test('Verify canSubmit() returns true when code is 6 chars', async () => {
  render(
    <Verify {...makeProps()}/>
  );
  const input = await screen.findByLabelText('Enter {length}-digit code');
  fireEvent.change(input, { target: { value: '123456' } });
  const next = await screen.findByText('Next');
  expect(next.hasAttribute('disabled')).toBe(false);
});

test('Verify handleInputKeyUp() treats enter key as a form submission when code is valid', async () => {
  const onCompleteVerification = jest.fn();
  render(
    <Verify {...makeProps({
      onCompleteVerification
    })}
    />
  );
  const input = await screen.findByLabelText('Enter {length}-digit code');
  fireEvent.change(input, { target: { value: '123456' } });
  fireEvent.keyUp(input, { keyCode: 13 });
  expect(onCompleteVerification).toHaveBeenCalled();
});

test('Verify handleInputKeyUp() does nothing when the code is invalid', async () => {
  const onCompleteVerification = jest.fn();
  render(
    <Verify {...makeProps({
      onCompleteVerification
    })}
    />
  );
  const input = await screen.findByLabelText('Enter {length}-digit code');
  fireEvent.change(input, { target: { value: 'ABC' } });
  fireEvent.keyUp(input, { keyCode: 13 });
  expect(onCompleteVerification).not.toHaveBeenCalled();
});

test('Verify handleSubmit() calls onCompleteVerification() and passes the code', async () => {
  const onCompleteVerification = jest.fn();
  render(
    <Verify {...makeProps({
      onCompleteVerification
    })}
    />
  );
  const input = await screen.findByLabelText('Enter {length}-digit code');
  fireEvent.change(input, { target: { value: '123456' } });
  const next = await screen.findByText('Next');
  fireEvent.click(next);
  expect(onCompleteVerification).toHaveBeenCalledWith({ code: '123456' });
});

test('Verify renderSupportLink() renders nothing when no support link is defined in the method', async () => {
  render(
    <Verify {...makeProps({
      method: {
        urlSegment: 'totp',
        name: 'TOTP',
      }
    })}
    />
  );
  await screen.findByLabelText('Enter {length}-digit code');
  expect(screen.queryByText('How to use authenticator apps.')).toBeNull();
});

test('Verify renderSupportLink() renders a support link for the provided method on both screens', async () => {
  render(
    <Verify {...makeProps()}/>
  );
  await screen.findByLabelText('Enter {length}-digit code');
  expect(screen.queryByText('How to use authenticator apps.')).not.toBeNull();
});

test('Verify renderVerifyForm() renders an input for the code', async () => {
  render(
    <Verify {...makeProps()}/>
  );
  const el = await screen.findByLabelText('Enter {length}-digit code');
  expect(el.classList).toContain('mfa-totp__code');
});

test('Verify renderVerifyForm() identifies errors when passed', async () => {
  render(
    <Verify {...makeProps({
      error: 'Something went wrong'
    })}
    />
  );
  const el = await screen.findByText('Something went wrong');
  expect(el).not.toBeNull();
});

test('Verify renders the method thumbnail', async () => {
  render(
    <Verify {...makeProps()}/>
  );
  const el = await screen.findByAltText('TOTP');
  expect(el.classList).toContain('mfa-totp__validate-img');
});

test('Verify renderVerifyForm() defaults to a 6 character code length', async () => {
  render(
    <Verify {...makeProps()}/>
  );
  const el = await screen.findByLabelText('Enter {length}-digit code');
  expect(el.getAttribute('maxlength')).toBe('6');
});

test('Verify renderVerifyForm() allows the code length to be configured', async () => {
  render(
    <Verify {...makeProps({
      codeLength: 12
    })}
    />
  );
  const el = await screen.findByLabelText('Enter {length}-digit code');
  expect(el.getAttribute('maxlength')).toBe('12');
});
