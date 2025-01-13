/* global window */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

/**
 * This component provides the user interface for logging in with a one-time time-based password
 * (TOTP) for a user.
 */
function Verify(props) {
  const {
    codeLength,
    error,
    moreOptionsControl,
    onCompleteVerification,
    method,
  } = props;

  const [code, setCode] = useState('');
  const [codeInput, setCodeInput] = useState(null);
  const i18n = window.ss.i18n;

  useEffect(() => {
    if (codeInput) {
      codeInput.focus();
    }
  }, [codeInput]);

  /**
   * Updates the code in the state when changing the input field
   */
  function handleChangeCode(event) {
    setCode(event.target.value);
  }

  /**
   * Determines whether the form can be submitted. This is true when on the "validate code"
   * screen and an input code of 6 chars is entered
   */
  function canSubmit() {
    return code.length === codeLength;
  }

  /**
   * Delegate the completion of verification/registration to the handler passed in as a prop. The
   * MFA module will provide this as an API request to the TOTP backend handler's register() or
   * verify() method.
   */
  function handleSubmit() {
    onCompleteVerification({ code });
  }

  /**
   * Track enter key presses and submit the form if the field is valid
   */
  function handleInputKeyUp(event) {
    if (canSubmit() && event.keyCode === 13) {
      handleSubmit();
    }
  }
  /**
   * Renders an action button menu with a Next and Back button, using a different handler for
   * the click of each button depending on which view we're in.
   */
  function renderActionsMenu() {
    const isNextDisabled = !canSubmit();
    return <ul className="mfa-action-list">
      <li className="mfa-action-list__item">
        <button
          type="button"
          className="btn btn-primary"
          disabled={isNextDisabled}
          onClick={handleSubmit}
        >
          { i18n._t('TOTPVerify.NEXT', 'Next') }
        </button>
      </li>
      {moreOptionsControl && (
        <li className="mfa-action-list__item">
          { moreOptionsControl }
        </li>
      )}
    </ul>;
  }

  /**
   * If there is a configured support link, will render a link to the TOTP authenticator's
   * support documentation (e.g. userhelp).
   */
  function renderSupportLink() {
    const { supportLink, supportText } = method;

    if (!supportLink) {
      return null;
    }

    return (
      <a href={supportLink} target="_blank" rel="noopener noreferrer">
        {supportText || i18n._t('TOTPVerify.HOW_TO_USE', 'How to use authenticator apps.')}
      </a>
    );
  }

  function renderVerifyForm() {
    const formGroupClasses = classnames('mfa-totp__validate-left', {
      'has-error': !!error,
    });
    return <div className="mfa-totp__validate-code">
      <div className={formGroupClasses}>
        <p>{ i18n._t(
          'TOTPVerify.VERIFY',
          'Use verification code from your authenticator app. '
        ) }{ renderSupportLink() }</p>
        <label htmlFor="totp-code" className="control-label">
          {
            i18n.inject(
              i18n._t('TOTPVerify.ENTER_CODE', 'Enter {length}-digit code'),
              { length: codeLength }
            )
          }
        </label>
        <input
          id="totp-code"
          name="code"
          type="text"
          autoComplete="off"
          maxLength={codeLength}
          className="mfa-totp__code text form-control input-lg"
          value={code}
          ref={setCodeInput}
          onChange={handleChangeCode}
          onKeyUp={handleInputKeyUp}
        />
        {error && <div className="help-block">{error}</div>}
      </div>
      {method.thumbnail && (
        <div className="mfa-totp__validate-right">
          <img
            src={method.thumbnail}
            alt={method.name}
            className="mfa-totp__validate-img"
          />
        </div>
      )}
    </div>;
  }

  // render the component
  return <div className="mfa-totp__container mfa-totp__container--verify">
    { renderVerifyForm() }
    { renderActionsMenu() }
  </div>;
}

Verify.propTypes = {
  codeLength: PropTypes.number,
  error: PropTypes.string,
  onCompleteVerification: PropTypes.func.isRequired,
  method: PropTypes.object.isRequired,
};

Verify.defaultProps = {
  codeLength: 6,
  error: null,
};

Verify.displayName = 'TOTPVerify';

export default Verify;
