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

test('Register initializes with error view when error prop is provided', async () => {
  render(
    <Register {...makeProps({
      error: 'Session expired'
    })}
    />
  );
  const el = await screen.findByTestId('totpverifycomponent');
  expect(el).not.toBeNull();
});

test('Register renderScanCodeScreen() displays formatted code', async () => {
  const { container } = render(
    <Register {...makeProps({
      code: 'ABC123DEF456'
    })}
    />
  );
  const codeElement = container.querySelector('.mfa-totp__manual-code');
  expect(codeElement).not.toBeNull();
  expect(codeElement.textContent).not.toBe('');
});

test('Register renderScanCodeScreen() does not render when errors are present', async () => {
  const { container } = render(
    <Register {...makeProps({
      errors: ['Error 1']
    })}
    />
  );
  expect(container.querySelectorAll('.mfa-totp__scan')).toHaveLength(0);
});

test('Register renderValidateCodeScreen() does not render when errors are present', async () => {
  const { container } = render(
    <Register {...makeProps({
      errors: ['Error 1']
    })}
    />
  );
  expect(container.querySelectorAll('[data-testid="totpverifycomponent"]')).toHaveLength(0);
});

test('Register renderValidateCodeScreen() passes error state to TOTPVerifyComponent', async () => {
  const onCompleteRegistration = jest.fn();
  const TestComponent = ({ error }) => (
    <div data-testid="verify-component">{error || 'no error'}</div>
  );
  render(
    <Register {...makeProps({
      error: 'Test error state',
      TOTPVerifyComponent: TestComponent,
      onCompleteRegistration
    })}
    />
  );
  const verifyComponent = await screen.findByTestId('verify-component');
  expect(verifyComponent.textContent).toBe('Test error state');
});

test('Register renderBackButtonForVerify() renders back button in verify screen', async () => {
  render(
    <Register {...makeProps()}/>
  );
  const next = await screen.findByText('Next');
  fireEvent.click(next);
  const backBtn = await screen.findByRole('button', { name: 'Back' });
  expect(backBtn.classList.contains('mfa-actions__action--back')).toBe(true);
});

test('Register renderSupportLink() uses custom supportText from method', async () => {
  render(
    <Register {...makeProps({
      method: {
        urlSegment: 'totp',
        name: 'TOTP',
        supportLink: 'https://example.com/help',
        supportText: 'Custom help link'
      }
    })}
    />
  );
  const customLink = await screen.findByText('Custom help link');
  expect(customLink).not.toBeNull();
  expect(customLink.getAttribute('href')).toBe('https://example.com/help');
});

test('Register renderValidateCodeScreen() passes moreOptionsControl to TOTPVerifyComponent', async () => {
  let capturedProps = null;
  const TestComponent = (props) => {
    capturedProps = props;
    return <div data-testid="verify-component" />;
  };
  render(
    <Register {...makeProps({
      TOTPVerifyComponent: TestComponent
    })}
    />
  );
  const next = await screen.findByText('Next');
  fireEvent.click(next);
  await screen.findByTestId('verify-component');
  expect(capturedProps.moreOptionsControl).not.toBeUndefined();
  expect(capturedProps.onCompleteVerification).not.toBeUndefined();
});

test('Register renders container with correct CSS classes', async () => {
  const { container } = render(
    <Register {...makeProps()}/>
  );
  const containerEl = container.querySelector('.mfa-totp__container');
  expect(containerEl).not.toBeNull();
  expect(containerEl.classList.contains('mfa-totp__container--register')).toBe(true);
});

test('Register renderErrorScreen() renders nothing when errors array is empty', async () => {
  const { container } = render(
    <Register {...makeProps({
      errors: []
    })}
    />
  );
  expect(container.querySelectorAll('.mfa-totp__errors')).toHaveLength(0);
});

test('Register renderActionsMenu() buttons have correct type attribute', async () => {
  const { container } = render(
    <Register {...makeProps()}/>
  );
  const buttons = container.querySelectorAll('button[type="button"]');
  expect(buttons.length).toBeGreaterThan(0);
});
