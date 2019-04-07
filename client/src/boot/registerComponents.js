import Injector from 'lib/Injector'; // eslint-disable-line
import Register from 'components/TOTP/Register';

export default () => {
  Injector.component.registerMany({
    TOTPRegister: Register,
  });
};
