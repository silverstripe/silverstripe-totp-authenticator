/* global window */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { QRCodeSVG } from 'qrcode.react';
import { formatCode } from 'lib/formatCode';
import { inject } from 'lib/Injector'; // eslint-disable-line

const VIEWS = {
  SCAN: 'SCAN_CODE',
  VALIDATE: 'VALIDATE_CODE',
};

/**
 * This component provides the user interface for registering one-time time-based passwords (TOTP)
 * with a user.
 */
const Register = ({
  code = '',
  onBack,
  onCompleteRegistration,
  errors = [],
  method,
  uri,
  TOTPVerifyComponent,
  error: initialError,
}) => {
  const [error, setError] = useState(initialError);
  const [view, setView] = useState(initialError ? VIEWS.VALIDATE : VIEWS.SCAN);

  /**
   * Send the user back to the "select method" screen
   */
  const handleBack = () => {
    onBack();
  };

  /**
   * Send the user back to the "scan QR code" screen
   */
  const handleBackToScan = () => {
    setView(VIEWS.SCAN);
    setError(null);
  };

  /**
   * After user has scanned the QR code, handle the transition to the verify screen
   */
  const handleNext = () => {
    setView(VIEWS.VALIDATE);
  };

  /**
   * Renders an action button menu with a Next and Back button, using a different handler for
   * the click of each button depending on which view we're in.
   *
   * @returns {HTMLElement}
   */
  const renderActionsMenu = () => {
    const { ss: { i18n } } = window;

    return (
      <ul className="mfa-action-list">
        <li className="mfa-action-list__item">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleNext}
          >
            { i18n._t('TOTPRegister.NEXT', 'Next') }
          </button>
        </li>
        <li className="mfa-action-list__item">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleBack}
          >
            { i18n._t('TOTPRegister.BACK', 'Back') }
          </button>
        </li>
      </ul>
    );
  };

  /**
   * Handles rendering of errors returned from the backend API requests, e.g.
   * your session has timed out.
   *
   * @returns {HTMLElement}
   */
  const renderErrorScreen = () => {
    if (!errors.length) {
      return null;
    }

    return (
      <div className="mfa-totp__errors">
        {errors.join(', ')}
      </div>
    );
  };

  /**
   * If there is a configured support link, will render a link to the TOTP authenticator's
   * support documentation (e.g. userhelp).
   *
   * @returns {HTMLElement}
   */
  const renderSupportLink = () => {
    const { supportLink, supportText } = method;
    const { ss: { i18n } } = window;

    if (!supportLink) {
      return null;
    }

    return (
      <a href={supportLink} target="_blank" rel="noopener noreferrer">
        {supportText || i18n._t('TOTPRegister.HOW_TO_USE', 'How to use authenticator apps.')}
      </a>
    );
  };

  /**
   * Renders the screen to scan a QR code with an authenticator app.
   *
   * @returns {HTMLElement}
   */
  const renderScanCodeScreen = () => {
    const { ss: { i18n } } = window;

    if (view !== VIEWS.SCAN || errors.length) {
      return null;
    }

    const formattedCode = formatCode(code);

    return (
      <div>
        <div className="mfa-totp__scan">
          <p>{ i18n._t(
            'TOTPRegister.INTRO',
            'Verification codes are created by an app on your phone. '
          ) }{ renderSupportLink() }</p>

          <div className="mfa-totp__scan-code">
            <div className="mfa-totp__scan-left">
              <QRCodeSVG value={uri} size={160} />
            </div>

            <div className="mfa-totp__scan-middle">
              {i18n._t('TOTPRegister.OR', 'Or')}
            </div>

            <div className="mfa-totp__scan-right">
              <p>{i18n._t(
                'TOTPRegister.MANUAL',
                'Enter manually the following code into authentication app:'
              )}</p>
              <p className="mfa-totp__manual-code">
                { formattedCode }
              </p>
            </div>
          </div>
        </div>
        { renderActionsMenu() }
      </div>
    );
  };

  /**
   * The back button for the verification screen should send you back to the register screen
   *
   * @return HTMLElement|null
   */
  const renderBackButtonForVerify = () => {
    const { ss: { i18n } } = window;

    return (
      <button
        type="button"
        className="mfa-actions__action mfa-actions__action--back btn btn-secondary"
        onClick={handleBackToScan}
      >
        { i18n._t('TOTPRegister.BACK', 'Back') }
      </button>
    );
  };

  /**
   * Renders the screen to input and validate the TOTP code, after having registered it via QR
   * code with an authenticator app.
   *
   * @returns {HTMLElement}
   */
  const renderValidateCodeScreen = () => {
    if (view !== VIEWS.VALIDATE || errors.length) {
      return null;
    }

    const verifyProps = {
      code,
      onBack,
      errors,
      method,
      uri,
      TOTPVerifyComponent,
      // Override the error prop to come from the state instead of props
      error,
      moreOptionsControl: renderBackButtonForVerify(),
      // Renaming registration callback so it fits in the Verify context
      onCompleteVerification: onCompleteRegistration,
    };

    return <TOTPVerifyComponent {...verifyProps} />;
  };

  return (
    <div className="mfa-totp__container mfa-totp__container--register">
      { renderErrorScreen() }
      { renderScanCodeScreen() }
      { renderValidateCodeScreen() }
    </div>
  );
};

Register.propTypes = {
  code: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
  onCompleteRegistration: PropTypes.func.isRequired,
  errors: PropTypes.arrayOf(PropTypes.string),
  method: PropTypes.object.isRequired,
  uri: PropTypes.string.isRequired,
  TOTPVerifyComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
};

Register.displayName = 'TOTPRegister';

export { Register as Component };

export default inject(
  ['TOTPVerify'],
  (TOTPVerifyComponent) => ({
    TOTPVerifyComponent,
  }),
  () => 'MFA.Register'
)(Register);
