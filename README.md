# SilverStripe TOTP Authenticator

Log in to SilverStripe with an authenticator app on your phone as a second factor, using a time-based one-time
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

You will need to define an environment variable named `SS_MFA_SECRET_KEY` with a random secret key, which is used
for encrypting the TOTP secret. The authentication method will not be available for use until this is correctly defined.
