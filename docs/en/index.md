---
title: TOTP Authenticator
summary: Installing and configuring the TOTP authenticator module.
icon: key
---

# TOTP authenticator

The TOTP (Time-based One-Time Password) authenticator module adds an extra layer of security to your Silverstripe CMS application by providing a multi-factor authentication (MFA) method. When a user has this method enabled, they will be required to provide a unique, time-sensitive code from an authenticator app (such as Google Authenticator or Authy) in addition to their password when logging in.

## Installation

```bash
composer require silverstripe/totp-authenticator
```

## Configuration

### Encryption key

You will need to define an environment variable named `SS_MFA_SECRET_KEY` with a random secret key, which is used
for encrypting the TOTP secret. The authentication method will not be available for use until this is correctly defined.

Please note that existing registered TOTP methods for users will not be usable on environments with different values
for `SS_MFA_SECRET_KEY` than they were registered in.

There are many ways to create a random secret key, the easiest
is by executing a `php` command on the command line. The secret key length depends on your
specific information security controls, but 32 characters is a good baseline.

```bash
php -r 'echo substr(base64_encode(random_bytes(32)), 0, 32) . "\n";'
```

### TOTP secret length

You can also configure the length of the TOTP secret. This is the code that is displayed to users when they register
to use TOTP, for example "alternatively, enter this code manually into your app." The default length is 16 characters.
If you do not want to support manual code entry in your project, you may want to increase the length in order to
increase the entropy of the TOTP secret, however removing the secret from the UI will require adjustments to the React
components. See the [`RegisterHandler.secret_length`](api:SilverStripe\TOTP\RegisterHandler->secret_length) configuration property.

```yml
SilverStripe\TOTP\RegisterHandler:
  secret_length: 64
```

### TOTP code length

If you want to change the length of the TOTP codes the application accepts, you can adjust [`Method.code_length`](api:SilverStripe\TOTP\Method->code_length). The
default length is 6 characters.

```yml
SilverStripe\TOTP\Method:
  code_length: 10
```

### User help link

When this method is used on the website during the multi-factor login process, it may show a "find out more" link
to user documentation. You can disable this by nullifying the configuration property [`RegisterHandler.user_help_link`](api:SilverStripe\TOTP\RegisterHandler->user_help_link)
or you can change it to point to your own documentation instead:

```yml
SilverStripe\TOTP\RegisterHandler:
  user_help_link: 'https://intranet.mycompany.com/help-docs/using-totp'
```

### TOTP issuer and label

The TOTP "issuer" is the Silverstripe site name (set in SiteConfig) by default, and the "label" is the member's email
address by default. These are the values that show up in your authenticator app. You can change these if you need
to use something else, by writing an extension on [`RegisterHandler`](api:SilverStripe\TOTP\RegisterHandler):

```php
// app/src/MFA/Extensions/MyTOTPRegisterHandlerExtension.php
namespace App\MFA\Extensions;

use OTPHP\TOTPInterface;
use SilverStripe\Core\Extension;
use SilverStripe\Security\Member;

class MyTOTPRegisterHandlerExtension extends Extension
{
    public function updateTotp(TOTPInterface $totp, Member $member)
    {
        $totp->setLabel($member->getCustomTOTPLabel());
        $totp->setIssuer('My web project');
    }
}
```
