/* global window */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';
import { formatCode } from 'lib/formatCode';

/**
 * This component provides the user interface for registering one-time time-based passwords (TOTP)
 * with a user.
 */
class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      view: 'SCAN_CODE',
      code: '',
    };

    this.handleBack = this.handleBack.bind(this);
    this.handleChangeCode = this.handleChangeCode.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * Send the user back to the "select method" screen
   */
  handleBack() {
    this.props.onBack();
  }

  /**
   * Updates the code in the state when changing the input field
   *
   * @param {object} event
   */
  handleChangeCode(event) {
    this.setState({
      code: event.target.value,
    });
  }

  /**
   * Delegate the completion of registration to the handler passed in as a prop. The MFA module
   * will provide this as an API request to the TOTP backend RegisterHandler's register() method.
   */
  handleSubmit() {
    this.props.onCompleteRegistration({ code: this.state.code });
  }

  /**
   * Renders an action button menu with a Next and Back button, using a different handler for
   * the click of each button depending on which view we're in.
   *
   * @returns {HTMLElement}
   */
  renderActionsMenu() {
    const { view, code } = this.state;
    const { ss: { i18n } } = window;

    // Define the click handlers depending on which view we're in
    const handlers = {
      next: view === 'SCAN_CODE'
        ? () => this.setState({ view: 'VALIDATE_CODE' })
        : this.handleSubmit,
      back: view === 'SCAN_CODE'
        ? this.handleBack
        : () => this.setState({ view: 'SCAN_CODE' }),
    };

    // Determine whether the Next button should be disabled
    const isNextDisabled = view === 'VALIDATE_CODE' && code.length !== 6;

    return (
      <div className="mfa-actions">
        <button
          type="button"
          className="mfa-actions__action mfa-actions__action--next btn btn-success"
          disabled={isNextDisabled}
          onClick={handlers.next}
        >
          { i18n._t('TOTPRegister.NEXT', 'Next') }
        </button>
        <button
          type="button"
          className="mfa-actions__action mfa-actions__action--back btn"
          onClick={handlers.back}
        >
          { i18n._t('TOTPRegister.BACK', 'Back') }
        </button>
      </div>
    );
  }

  /**
   * Renders the screen to scan a QR code with an authenticator app.
   *
   * @returns {HTMLElement}
   */
  renderScanCodeScreen() {
    const { uri, code } = this.props;
    const { view } = this.state;
    const { ss: { i18n } } = window;

    if (view !== 'SCAN_CODE') {
      return null;
    }

    const formattedCode = formatCode(code);

    return (
      <div className="mfa-register-totp__scan">
        <p>{ i18n._t(
          'TOTPRegister.INTRO',
          'Use an authentication app such as Google Authenticator to scan the following code. '
        ) }{ this.renderSupportLink() }</p>

        <div className="mfa-register-totp__scan-code">
          <div className="mfa-register-totp__scan-left">
            <QRCode value={uri} size={160} />
          </div>

          <div className="mfa-register-totp__scan-middle">
            {i18n._t('TOTPRegister.OR', 'Or')}
          </div>

          <div className="mfa-register-totp__scan-right">
            <p>{i18n._t(
              'TOTPRegister.MANUAL',
              'Enter manually the following code into authentication app:'
            )}</p>
            <p className="mfa-register-totp__manual-code">
              { formattedCode }
            </p>
          </div>
        </div>
      </div>
    );
  }

  /**
   * If there is a configured support link, will render a link to the TOTP authenticator's
   * support documentation (e.g. userhelp).
   *
   * @returns {HTMLElement}
   */
  renderSupportLink() {
    const { method } = this.props;
    const { ss: { i18n } } = window;

    if (!method.supportLink) {
      return null;
    }

    return (
      <a href={method.supportLink} target="_blank" rel="noopener noreferrer">
        { i18n._t('TOTPRegister.HOW_TO_USE', 'How to use authenticator app.') }
      </a>
    );
  }

  /**
   * Renders the screen to input and validate the TOTP code, after having registered it via QR
   * code with an authenticator app.
   *
   * @returns {HTMLElement}
   */
  renderValidateCodeScreen() {
    const { view, code } = this.state;
    const { method } = this.props;
    const { ss: { i18n } } = window;

    if (view !== 'VALIDATE_CODE') {
      return null;
    }

    return (
      <div className="mfa-register-totp__validate-code">
        <div className="mfa-register-totp__validate-left">
          <p>{ i18n._t(
            'TOTPRegister.VERIFY',
            'Use verification code from your authenticator app. '
            ) }{ this.renderSupportLink() }</p>

          <label htmlFor="totp-code">
            { i18n._t('TOTPRegister.ENTER_CODE', 'Enter 6-digit code') }
          </label>
          <input
            id="totp-code"
            name="code"
            type="text"
            maxLength="6"
            className="mfa-register-totp__code form-control input-lg"
            value={code}
            onChange={this.handleChangeCode}
          />
        </div>

        {method.thumbnail && (
          <div className="mfa-register-totp__validate-right">
            <img
              src={method.thumbnail}
              alt={method.name}
              className="mfa-register-totp__validate-img"
            />
          </div>
        )}
      </div>
    );
  }

  render() {
    return (
      <div className="mfa-register-totp__container">
        { this.renderScanCodeScreen() }
        { this.renderValidateCodeScreen() }
        { this.renderActionsMenu() }
      </div>
    );
  }
}

Register.propTypes = {
  code: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
  method: PropTypes.object.isRequired,
  onCompleteRegistration: PropTypes.func.isRequired,
  uri: PropTypes.string.isRequired,
};

export default Register;
