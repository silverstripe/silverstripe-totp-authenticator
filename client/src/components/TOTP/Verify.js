/* global window */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

/**
 * This component provides the user interface for logging in with a one-time time-based password
 * (TOTP) for a user.
 */
class Verify extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: '',
    };

    // Note: deliberately React 15 compatible ref syntax for SS 4.0-4.3 support
    this.codeInput = null;
    this.setCodeInput = element => {
      this.codeInput = element;
    };

    // Prevents the same code from being submitted twice, e.g. by an auto-submit followed by
    // an enter key press
    this.submitted = false;

    this.handleChangeCode = this.handleChangeCode.bind(this);
    this.handlePasteCode = this.handlePasteCode.bind(this);
    this.handleInputKeyUp = this.handleInputKeyUp.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * Automatically set the focus to the code input field when the component is rendered
   */
  componentDidMount() {
    if (this.codeInput) {
      this.codeInput.focus();
    }
  }

  /**
   * Updates the code in the state when changing the input field
   *
   * @param {object} event
   */
  handleChangeCode(event) {
    this.updateCode(event.target.value);
  }

  /**
   * Handles pasting a code into the input field. Whitespace is stripped before the input's
   * maxLength is applied, so a code copied as "123 456" is not truncated.
   *
   * @param {object} event
   */
  handlePasteCode(event) {
    if (!event.clipboardData) {
      return;
    }
    event.preventDefault();
    this.updateCode(event.clipboardData.getData('text'));
  }

  /**
   * Stores the code without whitespace in the state, and submits it automatically once the full
   * code length has been entered (if auto-submit is enabled)
   *
   * @param {string} value
   */
  updateCode(value) {
    const { autoSubmit, codeLength } = this.props;
    const code = value.replace(/\s/g, '').slice(0, codeLength);

    this.submitted = false;
    this.setState({ code }, () => {
      if (autoSubmit && this.canSubmit()) {
        this.handleSubmit();
      }
    });
  }

  /**
   * Track enter key presses and submit the form if the field is valid
   *
   * @param {object} event
   */
  handleInputKeyUp(event) {
    if (this.canSubmit() && event.key === 'Enter') {
      this.handleSubmit();
    }
  }

  /**
   * Delegate the completion of verification/registration to the handler passed in as a prop. The
   * MFA module will provide this as an API request to the TOTP backend handler's register() or
   * verify() method.
   */
  handleSubmit() {
    if (this.submitted) {
      return;
    }
    this.submitted = true;
    this.props.onCompleteVerification({ code: this.state.code });
  }

  /**
   * Determines whether the form can be submitted. This is true when on the "validate code"
   * screen and an input code of 6 chars is entered
   *
   * @returns {boolean}
   */
  canSubmit() {
    return this.state.code.length === this.props.codeLength;
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
      <ul className="mfa-action-list">
        <li className="mfa-action-list__item">
          <button
            type="button"
            className="btn btn-primary"
            disabled={isNextDisabled}
            onClick={this.handleSubmit}
          >
            { i18n._t('TOTPVerify.NEXT', 'Next') }
          </button>
        </li>
        {moreOptionsControl && (
          <li className="mfa-action-list__item">
            { moreOptionsControl }
          </li>
        )}
      </ul>
    );
  }

  /**
   * If there is a configured support link, will render a link to the TOTP authenticator's
   * support documentation (e.g. userhelp).
   *
   * @returns {HTMLElement}
   */
  renderSupportLink() {
    const { method: { supportLink, supportText } } = this.props;
    const { ss: { i18n } } = window;

    if (!supportLink) {
      return null;
    }

    return (
      <a href={supportLink} target="_blank" rel="noopener noreferrer">
        {supportText || i18n._t('TOTPVerify.HOW_TO_USE', 'How to use authenticator apps.')}
      </a>
    );
  }

  renderVerifyForm() {
    const { code } = this.state;
    const { codeLength, error, method } = this.props;
    const { ss: { i18n } } = window;

    const formGroupClasses = classnames('mfa-totp__validate-left', 'form-group', {
      'has-error': !!error,
    });

    return (
      <div className="mfa-totp__validate-code">
        <div className={formGroupClasses}>
          <p>{ i18n._t(
            'TOTPVerify.VERIFY',
            'Use verification code from your authenticator app. '
          ) }{ this.renderSupportLink() }</p>

          <label htmlFor="totp-code" className="control-label form-label">
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
            ref={this.setCodeInput}
            onChange={this.handleChangeCode}
            onPaste={this.handlePasteCode}
            onKeyUp={this.handleInputKeyUp}
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
      </div>
    );
  }

  render() {
    return (
      <div className="mfa-totp__container mfa-totp__container--verify">
        { this.renderVerifyForm() }
        { this.renderActionsMenu() }
      </div>
    );
  }
}

Verify.propTypes = {
  autoSubmit: PropTypes.bool,
  codeLength: PropTypes.number,
  error: PropTypes.string,
  onCompleteVerification: PropTypes.func.isRequired,
  method: PropTypes.object.isRequired,
};

Verify.defaultProps = {
  autoSubmit: false,
  codeLength: 6,
  error: null,
};

Verify.displayName = 'TOTPVerify';

export default Verify;
