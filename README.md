# SilverStripe TOTP Authenticator

[![Build Status](https://travis-ci.com/silverstripe/silverstripe-totp-authenticator.svg?branch=master)](https://travis-ci.com/silverstripe/silverstripe-totp-authenticator)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/silverstripe/silverstripe-totp-authenticator/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/silverstripe/silverstripe-totp-authenticator/?branch=master)
[![codecov](https://codecov.io/gh/silverstripe/silverstripe-totp-authenticator/branch/master/graph/badge.svg)](https://codecov.io/gh/silverstripe/silverstripe-totp-authenticator)
[![SilverStripe supported module](https://img.shields.io/badge/silverstripe-supported-0071C4.svg)](https://www.silverstripe.org/software/addons/silverstripe-commercially-supported-module-list/)

Log in to SilverStripe with an authenticator app on your phone as a secondary factor, using a time-based one-time
password (TOTP).

This module provides a TOTP authenticator that plugs in to the [silverstripe/mfa](https://github.com/silverstripe/mfa)
module.

For more information about TOTP, see [RFC 6238](https://tools.ietf.org/html/rfc6238).

## Requirements

* PHP ^7.1
* SilverStripe ^3.7
* silverstripe/mfa: ^3.0
* spomky-labs/otphp: ^9.1

## Installation

Install with Composer:

```
composer require silverstripe/totp-authenticator ^3.0
```

For SilverStripe 4.0 support, please use `silverstripe/totp-authenticator ^4.0`.

## Configuration

### Encryption key

You will need to define an environment variable or PHP constant named `SS_MFA_SECRET_KEY` with a random secret key,
which is used for encrypting the TOTP secret. The authentication method will not be available for use until this
is correctly defined. This should be done in your `_ss_environment.php` file.

If your hosting includes both a production and test environment (e.g UAT) and someone may restore a database snapshot
from one environment to the other, then you'll want `SS_MFA_SECRET_KEY` to be the same on both environments.
If `SS_MFA_SECRET_KEY` is different between environments, restoring a snapshot will requires previously authenticated
users to have their registered authenticator app reset by an admin in the security section of the CMS.

### TOTP secret length

You can also configure the length of the TOTP secret. This is the code that is displayed to users when they register
to use TOTP, for example "alternatively, enter this code manually into your app." The default length is 16 characters.
If you do not want to support manual code entry in your project, you may want to increase the length in order to
increase the entropy of the TOTP secret, however removing the secret from the UI will require adjustments to the React
components. See the `RegisterHandler.secret_length` configuration property.

```yaml
SilverStripe\TOTP\RegisterHandler:
  secret_length: 64
```

### TOTP code length

If you want to change the length of the TOTP codes the application accepts, you can adjust `Method.code_length`. The
default length is 6 characters.

```yaml
SilverStripe\TOTP\Method:
  code_length: 10
```

### User help link

When this method is used on the website during the multi-factor login process, it may show a "find out more" link
to user documentation. You can disable this by nullifying the configuration property `RegisterHandler.user_help_link`
or you can change it to point to your own documentation instead:

```yaml
SilverStripe\TOTP\RegisterHandler:
  user_help_link: 'https://intranet.mycompany.com/help-docs/using-totp'
```

### TOTP issuer and label

The TOTP "issuer" is the SilverStripe site name (set in SiteConfig) by default, and the "label" is the member's email
address by default. These are the values that show up in your authenticator app. You can change these if you need
to use something else, by writing an extension on `RegisterHandler`:

```php
class MyTOTPRegisterHandlerExtension extends Extension
{
    public function updateTotp(\OTPHP\TOTPInterface $totp, \Member $member)
    {
        $totp->setLabel($member->getCustomTOTPLabel());
        $totp->setIssuer('My web project');
    }
}
```

## License

See [License](LICENSE.md)

## Bugtracker

Bugs are tracked in the issues section of this repository [on GitHub](https://github.com/silverstripe/silverstripe-totp-authenticator). Before submitting an issue please read over
existing issues to ensure yours is unique.

If the issue does look like a new bug:

 - Create a new issue
 - Describe the steps required to reproduce your issue, and the expected outcome. Unit tests, screenshots
   and screencasts can help here.
 - Describe your environment as detailed as possible: SilverStripe version, Browser, PHP version,
   Operating System, any installed SilverStripe modules.

Please report security issues to the module maintainers directly. Please don't file security issues in the bug tracker.

## Development and contribution

If you would like to make contributions to the module please ensure you raise a pull request and discuss with the
module maintainers.

## Notes

Unfortunately, [SilverStripe 3 has entered limited support in June 2018](https://www.silverstripe.org/blog/update-on-silverstripe-5-x/). This means we'll only be fixing critical bugs and security issues for SilverStripe 3 going forward.

You can read the [SilverStripe Roadmap](https://www.silverstripe.org/software/roadmap/) for more information on our support commitments.
