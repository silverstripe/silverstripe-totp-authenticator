# SilverStripe TOTP Authenticator

[![Build Status](https://travis-ci.com/silverstripe/silverstripe-totp-authenticator.svg?branch=master)](https://travis-ci.com/silverstripe/silverstripe-totp-authenticator)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/silverstripe/silverstripe-totp-authenticator/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/silverstripe/silverstripe-totp-authenticator/?branch=master)
[![codecov](https://codecov.io/gh/silverstripe/silverstripe-totp-authenticator/branch/master/graph/badge.svg)](https://codecov.io/gh/silverstripe/silverstripe-totp-authenticator)
[![SilverStripe supported module](https://img.shields.io/badge/silverstripe-supported-0071C4.svg)](https://www.silverstripe.org/software/addons/silverstripe-commercially-supported-module-list/)

Log in to SilverStripe with an authenticator app on your phone as a secondary factor, using a time-based one-time
password (TOTP).

This module provides a TOTP authenticator that plugs in to the [silverstripe/mfa](https://github.com/silverstripe/mfa)
module.

## Requirements

* PHP ^7.1
* SilverStripe ^4.0
* spomky-labs/otphp: ^9.1

## Installation

Install with Composer:

```
composer require silverstripe/totp-authenticator
```

## Configuration

### Encryption key

You will need to define an environment variable named `SS_MFA_SECRET_KEY` with a random secret key, which is used
for encrypting the TOTP secret. The authentication method will not be available for use until this is correctly defined.

### TOTP secret length

You can also configure the length of the TOTP secret. This is the code that is displayed to users when they register
to use TOTP, for example "alternatively, enter this code manually into your app." The default length is 16 characters.
If you do not want to support manual code entry in your project, you may want to increase the length. See the
`RegisterHandler.secret_length` configuration property.

### TOTP code length

If you want to change the length of the TOTP codes the application accepts, you can adjust `Method.code_length`. The
default length is 6 characters.
