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

test('Verify input field has correct attributes for password entry', async () => {
  render(
    <Verify {...makeProps()}/>
  );
  const input = await screen.findByLabelText('Enter {length}-digit code');
  expect(input.getAttribute('type')).toBe('text');
  expect(input.getAttribute('name')).toBe('code');
  expect(input.getAttribute('autocomplete')).toBe('off');
  expect(input.getAttribute('id')).toBe('totp-code');
});

test('Verify input field has correct CSS classes', async () => {
  render(
    <Verify {...makeProps()}/>
  );
  const input = await screen.findByLabelText('Enter {length}-digit code');
  expect(input.classList).toContain('mfa-totp__code');
  expect(input.classList).toContain('form-control');
  expect(input.classList).toContain('input-lg');
});

test('Verify displays form group with has-error class when error is present', async () => {
  const { container } = render(
    <Verify {...makeProps({
      error: 'Invalid code'
    })}
    />
  );
  const formGroup = container.querySelector('.mfa-totp__validate-left.has-error');
  expect(formGroup).not.toBeNull();
});

test('Verify does not display has-error class when no error', async () => {
  const { container } = render(
    <Verify {...makeProps()}/>
  );
  const formGroup = container.querySelector('.mfa-totp__validate-left.has-error');
  expect(formGroup).toBeNull();
});

test('Verify renderSupportLink() renders custom support text when provided', async () => {
  render(
    <Verify {...makeProps({
      method: {
        urlSegment: 'totp',
        name: 'TOTP',
        supportLink: 'https://example.com/help',
        supportText: 'Custom help text',
      }
    })}
    />
  );
  await screen.findByLabelText('Enter {length}-digit code');
  const link = screen.getByText('Custom help text');
  expect(link.getAttribute('href')).toBe('https://example.com/help');
  expect(link.getAttribute('target')).toBe('_blank');
  expect(link.getAttribute('rel')).toBe('noopener noreferrer');
});

test('Verify renderSupportLink() opens support link in new window with security attributes', async () => {
  render(
    <Verify {...makeProps()}/>
  );
  await screen.findByLabelText('Enter {length}-digit code');
  const link = screen.getByText('How to use authenticator apps.');
  expect(link.getAttribute('target')).toBe('_blank');
  expect(link.getAttribute('rel')).toBe('noopener noreferrer');
});

test('Verify renderActionsMenu() renders button with correct classes when enabled', async () => {
  render(
    <Verify {...makeProps()}/>
  );
  const input = await screen.findByLabelText('Enter {length}-digit code');
  fireEvent.change(input, { target: { value: '123456' } });
  const button = await screen.findByText('Next');
  expect(button.classList).toContain('btn');
  expect(button.classList).toContain('btn-primary');
  expect(button.getAttribute('type')).toBe('button');
});

test('Verify renderActionsMenu() renders moreOptionsControl when provided', async () => {
  const moreOptionsControl = <button type="button" data-testid="more-options">More Options</button>;
  render(
    <Verify {...makeProps({
      moreOptionsControl
    })}
    />
  );
  const moreButton = await screen.findByTestId('more-options');
  expect(moreButton).not.toBeNull();
});

test('Verify renderActionsMenu() does not render moreOptionsControl when not provided', async () => {
  render(
    <Verify {...makeProps({
      moreOptionsControl: null
    })}
    />
  );
  const items = screen.getAllByRole('listitem');
  expect(items.length).toBe(1);
});

test('Verify does not render thumbnail when method has no thumbnail', async () => {
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
  expect(screen.queryByAltText('TOTP')).toBeNull();
});

test('Verify renders main container with correct classes', async () => {
  const { container } = render(
    <Verify {...makeProps()}/>
  );
  const mainContainer = container.querySelector('.mfa-totp__container.mfa-totp__container--verify');
  expect(mainContainer).not.toBeNull();
});

test('Verify clears code input field when code is partially entered then cleared', async () => {
  render(
    <Verify {...makeProps()}/>
  );
  const input = await screen.findByLabelText('Enter {length}-digit code');
  fireEvent.change(input, { target: { value: '12345' } });
  expect(input.value).toBe('12345');
  fireEvent.change(input, { target: { value: '' } });
  expect(input.value).toBe('');
  const next = await screen.findByText('Next');
  expect(next.hasAttribute('disabled')).toBe(true);
});

test('Verify handleInputKeyUp() ignores non-enter keys', async () => {
  const onCompleteVerification = jest.fn();
  render(
    <Verify {...makeProps({
      onCompleteVerification
    })}
    />
  );
  const input = await screen.findByLabelText('Enter {length}-digit code');
  fireEvent.change(input, { target: { value: '123456' } });
  fireEvent.keyUp(input, { keyCode: 27 });
  expect(onCompleteVerification).not.toHaveBeenCalled();
});

test('Verify renders help text for entering code', async () => {
  render(
    <Verify {...makeProps()}/>
  );
  const helpText = await screen.findByText(/Use verification code from your authenticator app/);
  expect(helpText).not.toBeNull();
});
