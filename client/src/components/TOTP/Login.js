/* global window */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

/**
 * This component provides the user interface for registering one-time time-based passwords (TOTP)
 * with a user.
 */
class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: '',
    };

    this.handleBack = this.handleBack.bind(this);
    this.handleChangeCode = this.handleChangeCode.bind(this);
    this.handleInputKeyUp = this.handleInputKeyUp.bind(this);
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
   * Track enter key presses and submit the form if the field is valid
   *
   * @param {object} event
   */
  handleInputKeyUp(event) {
    if (this.canSubmit() && event.keyCode === 13) {
      this.handleSubmit();
    }
  }

  /**
   * Delegate the completion of login/registration to the handler passed in as a prop. The MFA
   * module will provide this as an API request to the TOTP backend handler's register()
   * or verify() method.
   */
  handleSubmit() {
    this.props.onCompleteLogin({ code: this.state.code });
  }

  /**
   * Determines whether the form can be submitted. This is true when on the "validate code"
   * screen and an input code of 6 chars is entered
   *
   * @returns {boolean}
   */
  canSubmit() {
    return this.state.code.length === 6;
  }

  /**
   * Renders an action button menu with a Next and Back button, using a different handler for
   * the click of each button depending on which view we're in.
   *
   * @returns {HTMLElement}
   */
  renderActionsMenu() {
    const { moreOptionsControl } = this.props;
    const { ss: { i18n } } = window;

    const isNextDisabled = !this.canSubmit();

    return (
      <div className="mfa-actions">
        <button
          type="button"
          className="mfa-actions__action mfa-actions__action--next btn btn-success"
          disabled={isNextDisabled}
          onClick={this.handleSubmit}
        >
          { i18n._t('TOTPRegister.NEXT', 'Next') }
        </button>
        { moreOptionsControl }
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

  renderVerifyForm() {
    const { code } = this.state;
    const { method, error } = this.props;
    const { ss: { i18n } } = window;

    const formGroupClasses = classnames('mfa-totp__validate-left form-group', {
      'has-error': !!error,
    });

    return (
      <div className="mfa-totp__validate-code">
        <div className={formGroupClasses}>
          <p>{ i18n._t(
            'TOTPLogin.VERIFY',
            'Use verification code from your authenticator app. '
          ) }{ this.renderSupportLink() }</p>

          <label htmlFor="totp-code">
            { /* todo make this configurable */ }
            { i18n._t('TOTPLogin.ENTER_CODE', 'Enter 6-digit code') }
          </label>
          <input
            id="totp-code"
            name="code"
            type="text"
            maxLength="6"
            className="mfa-totp__code form-control input-lg"
            value={code}
            onChange={this.handleChangeCode}
            onKeyUp={this.handleInputKeyUp}
          />
          {error && <div className="help-block">
            {i18n._t('TOTPLogin.ERROR', 'Invalid code')}
          </div>}
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
      </div>
    );
  }

  render() {
    return (
      <div className="mfa-totp__container mfa-totp__container--login">
        { this.renderVerifyForm() }
        { this.renderActionsMenu() }
      </div>
    );
  }
}

Login.propTypes = {
  onCompleteLogin: PropTypes.func.isRequired,
  method: PropTypes.object.isRequired,
};

export default Login;
