<?php declare(strict_types=1);

namespace SilverStripe\TOTP;

use SS_Object;

/**
 * Loads the TOTP secret key (used for encryption)
 */
class SecretKeyLoader extends SS_Object
{
    /**
     * Gets the secret key either from the environment or from a PHP constant
     *
     * @return string
     */
    public function get(): string
    {
        $environment = getenv('SS_MFA_SECRET_KEY');
        $constant = defined('SS_MFA_SECRET_KEY') ? constant('SS_MFA_SECRET_KEY') : '';
        return (string) ($environment ?? $constant);
    }
}
