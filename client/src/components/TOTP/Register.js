/* global window */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';

/**
 * This component provides the user interface for registering one-time time-based passwords (TOTP)
 * with a user.
 */
class Register extends PureComponent {
  render() {
    const { uri } = this.props;

    return (
      <div className="mfa-register-totp__container">
        <QRCode value={uri} size={256} />
      </div>
    );
  }
}

Register.propTypes = {
  uri: PropTypes.string.isRequired,
};

export default Register;
