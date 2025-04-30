# Silverstripe TOTP Authenticator

[![CI](https://github.com/silverstripe/silverstripe-totp-authenticator/actions/workflows/ci.yml/badge.svg)](https://github.com/silverstripe/silverstripe-totp-authenticator/actions/workflows/ci.yml)
[![Silverstripe supported module](https://img.shields.io/badge/silverstripe-supported-0071C4.svg)](https://www.silverstripe.org/software/addons/silverstripe-commercially-supported-module-list/)

Log in to Silverstripe with an authenticator app on your phone as a secondary factor, using a time-based one-time
password (TOTP).

This module provides a TOTP authenticator that plugs in to the [silverstripe/mfa](https://github.com/silverstripe/silverstripe-mfa)
module.

For more information about TOTP, see [RFC 6238](https://tools.ietf.org/html/rfc6238).

## Installation

```bash
composer require silverstripe/totp-authenticator
```

## Documentation

Read the [Silverstripe TOTP authenticator documentation](https://docs.silverstripe.org/en/optional_features/mfa/authenticators/totp-authenticator/).

## License

See [License](LICENSE.md)

## Bugtracker

Bugs are tracked in the issues section of this repository. Before submitting an issue please read over
existing issues to ensure yours is unique.

If the issue does look like a new bug:

 - Create a new issue
 - Describe the steps required to reproduce your issue, and the expected outcome. Unit tests, screenshots
   and screencasts can help here.
 - Describe your environment as detailed as possible: Silverstripe version, Browser, PHP version,
   Operating System, any installed Silverstripe modules.

Please report security issues to the module maintainers directly. Please don't file security issues in the bug tracker.

## Development and contribution

If you would like to make contributions to the module please ensure you raise a pull request and discuss with the
module maintainers.
