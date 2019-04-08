/* global window */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';

/**
 * This component provides the user interface for registering one-time time-based passwords (TOTP)
 * with a user.
 */
class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: '',
    };

    this.handleChangeCode = this.handleChangeCode.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeCode(event) {
    this.setState({
      code: event.target.value,
    });
  }

  handleSubmit() {
    return this.props.onCompleteRegistration({ code: this.state.code });
  }

  render() {
    const { uri } = this.props;
    const { code } = this.state;

    return (
      <div className="mfa-register-totp__container">
        <QRCode value={uri} size={256} />

        <input
          id="totpcode"
          name="code"
          type="text"
          value={code}
          placeholder="Enter your code"
          onChange={this.handleChangeCode}
        />
        <button type="button" onClick={this.handleSubmit}>
          Validate
        </button>
      </div>
    );
  }
}

Register.propTypes = {
  onCompleteRegistration: PropTypes.func.isRequired,
  uri: PropTypes.string.isRequired,
};

export default Register;
