import Injector from 'lib/Injector'; // eslint-disable-line
import Verify from 'components/TOTP/Verify';
import Register from 'components/TOTP/Register';

export default () => {
  Injector.component.registerMany({
    TOTPRegister: Register,
    TOTPVerify: Verify,
  });
};
