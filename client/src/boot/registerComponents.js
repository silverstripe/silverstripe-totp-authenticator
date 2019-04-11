import Injector from 'lib/Injector'; // eslint-disable-line
import Login from 'components/TOTP/Login';
import Register from 'components/TOTP/Register';

export default () => {
  Injector.component.registerMany({
    TOTPRegister: Register,
    TOTPLogin: Login,
  });
};
