/* global jest, test, expect */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Component as Register } from '../Register';

window.ss = {
  i18n: { _t: (key, string) => string },
};

function makeProps(obj = {}) {
  return {
    onBack: () => null,
    onCompleteRegistration: () => null,
    method: {
      urlSegment: 'totp',
      name: 'TOTP',
      description: 'Register using TOTP',
      supportLink: 'https://google.com',
      component: 'TOTPRegister',
    },
    code: 'FOO123',
    uri: 'example',
    TOTPVerifyComponent: ({ moreOptionsControl }) => (
      <div data-testid="totpverifycomponent">
        {moreOptionsControl}
      </div>
    ),
    ...obj
  };
}

test('Register handleBack() calls the onBack prop', async () => {
  const onBack = jest.fn();
  render(
    <Register {...makeProps({
      onBack
    })}
    />
  );
  const back = await screen.findByText('Back');
  fireEvent.click(back);
  expect(onBack).toHaveBeenCalled();
});

test('Register renderErrorScreen renders the providded errors', async () => {
  render(
    <Register {...makeProps({
      errors: ['Something went wrong', 'I am a unit test'],
    })}
    />
  );
  const el = await screen.findByText('Something went wrong, I am a unit test');
  expect(el.classList).toContain('mfa-totp__errors');
});

test('Register handleBackToScan() clears errors when clicking on the back button', async () => {
  const { container } = render(
    <Register {...makeProps({
      error: 'Something went wrong'
    })}
    />
  );
  const back = await screen.findByText('Back');
  fireEvent.click(back);
  const el = await screen.findByText('How to use authenticator apps.');
  expect(el).not.toBeNull();
  expect(container.querySelectorAll('.mfa-totp__errors')).toHaveLength(0);
});

test('Register renderActionsMenu() renders a "Next" and "Back" button', async () => {
  render(
    <Register {...makeProps()}/>
  );
  const next = await screen.findByText('Next');
  const back = await screen.findByText('Back');
  expect(next).not.toBeNull();
  expect(back).not.toBeNull();
});

test('Register goes to the input validation screen when clicking "Next" on the QR code screen', async () => {
  render(
    <Register {...makeProps()}/>
  );
  const next = await screen.findByText('Next');
  fireEvent.click(next);
  const el = await screen.findByTestId('totpverifycomponent');
  expect(el).not.toBeNull();
});

test('Register renderScanCodeScreen() renders a QR code', async () => {
  const { container } = render(
    <Register {...makeProps()}/>
  );
  await screen.findByText('How to use authenticator apps.');
  expect(container.querySelectorAll('.mfa-totp__scan-left svg')).toHaveLength(1);
});

test('Register renderSupportLink() renders nothing when no support link is defined in the method', async () => {
  render(
    <Register {...makeProps({
      method: {
        urlSegment: 'totp',
        name: 'TOTP',
      }
    })}
    />
  );
  await screen.findByText('Verification codes are created by an app on your phone.');
  expect(screen.queryByText('How to use authenticator apps.')).toBeNull();
});

test('Register renderSupportLink() renders a support link for the provided method on both screens', async () => {
  render(
    <Register {...makeProps()}/>
  );
  await screen.findByText('Verification codes are created by an app on your phone.');
  expect(screen.queryByText('How to use authenticator apps.')).not.toBeNull();
});
