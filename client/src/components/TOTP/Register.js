/* global window */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';
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
class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      view: VIEWS.SCAN,
    };

    this.handleBack = this.handleBack.bind(this);
    this.handleNext = this.handleNext.bind(this);
  }

  /**
   * Send the user back to the "select method" screen
   */
  handleBack() {
    this.props.onBack();
  }

  /**
   * After user has scanned the QR code, handle the transition to the login screen
   */
  handleNext() {
    this.setState({ view: VIEWS.VALIDATE });
  }

  /**
   * Renders an action button menu with a Next and Back button, using a different handler for
   * the click of each button depending on which view we're in.
   *
   * @returns {HTMLElement}
   */
  renderActionsMenu() {
    const { ss: { i18n } } = window;

    return (
      <div className="mfa-actions">
        <button
          type="button"
          className="mfa-actions__action mfa-actions__action--next btn btn-success"
          onClick={this.handleNext}
        >
          { i18n._t('TOTPRegister.NEXT', 'Next') }
        </button>
        <button
          type="button"
          className="mfa-actions__action mfa-actions__action--back btn"
          onClick={this.handleBack}
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

    if (view !== VIEWS.SCAN) {
      return null;
    }

    const formattedCode = formatCode(code);

    return (
      <Fragment>
        <div className="mfa-totp__scan">
          <p>{ i18n._t(
            'TOTPRegister.INTRO',
            'Use an authentication app such as Google Authenticator to scan the following code. '
          ) }{ this.renderSupportLink() }</p>

          <div className="mfa-totp__scan-code">
            <div className="mfa-totp__scan-left">
              <QRCode value={uri} size={160} />
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
        { this.renderActionsMenu() }
      </Fragment>
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
   * The back button for the login screen should send you back to the register screen
   *
   * @return HTMLElement|null
   */
  renderBackButtonForLogin() {
    const { ss: { i18n } } = window;

    return (
      <button
        type="button"
        className="mfa-actions__action mfa-actions__action--back btn"
        onClick={() => this.setState({ view: VIEWS.SCAN })}
      >
        { i18n._t('TOTPRegister.BACK', 'Back') }
      </button>
    );
  }

  /**
   * Renders the screen to input and validate the TOTP code, after having registered it via QR
   * code with an authenticator app.
   *
   * @returns {HTMLElement}
   */
  renderValidateCodeScreen() {
    const { view } = this.state;
    const { TOTPLoginComponent, onCompleteRegistration } = this.props;

    if (view !== VIEWS.VALIDATE) {
      return null;
    }

    const loginProps = {
      ...this.props,
      moreOptionsControl: this.renderBackButtonForLogin(),
      // Renaming registration callback so it fits in the Login context
      onCompleteLogin: onCompleteRegistration,
      onCompleteRegistration: null,
    };

    return <TOTPLoginComponent {...loginProps} />;
  }

  render() {
    return (
      <div className="mfa-totp__container mfa-totp__container--register">
        { this.renderScanCodeScreen() }
        { this.renderValidateCodeScreen() }
      </div>
    );
  }
}

Register.propTypes = {
  code: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
  onCompleteRegistration: PropTypes.func.isRequired,
  method: PropTypes.object.isRequired,
  uri: PropTypes.string.isRequired,
  TOTPLoginComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
};

Register.displayName = 'TOTPRegister';

export { Register as Component };

export default inject(
  ['TOTPLogin'],
  (TOTPLoginComponent) => ({
    TOTPLoginComponent,
  }),
  () => 'MFA.Register'
)(Register);
