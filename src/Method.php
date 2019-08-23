<?php declare(strict_types=1);

namespace SilverStripe\TOTP;

use Director;
use Injector;
use Requirements;
use SilverStripe\MFA\Method\Handler\RegisterHandlerInterface;
use SilverStripe\MFA\Method\Handler\VerifyHandlerInterface;
use SilverStripe\MFA\Method\MethodInterface;
use SS_Object;

/**
 * Enables time-based one-time password (TOTP) authentication for the silverstripe/mfa module.
 */
class Method extends SS_Object implements MethodInterface
{
    /**
     * The TOTP code length
     *
     * @config
     * @var int
     */
    private static $code_length = 6;

    public function getName(): string
    {
        return _t(__CLASS__ . '.NAME', 'Authenticator app');
    }

    public function getURLSegment(): string
    {
        return 'totp';
    }

    public function getVerifyHandler(): VerifyHandlerInterface
    {
        return Injector::inst()->create(VerifyHandler::class);
    }

    public function getRegisterHandler(): RegisterHandlerInterface
    {
        return Injector::inst()->create(RegisterHandler::class);
    }

    public function getThumbnail(): string
    {
        return Director::absoluteURL('totp-authenticator/client/dist/images/totp.svg');
    }

    public function applyRequirements(): void
    {
        Requirements::javascript('totp-authenticator/client/dist/js/bundle.js');
        Requirements::css('totp-authenticator/client/dist/styles/bundle.css');
    }

    /**
     * TOTP authentication is only available if the required environment variable is set to enable encryption.
     *
     * @return bool
     */
    public function isAvailable(): bool
    {
        $secretKey = SecretKeyLoader::singleton()->get();
        return !empty($secretKey);
    }

    public function getUnavailableMessage(): string
    {
        return _t(__CLASS__ . '.NOT_CONFIGURED', 'This method has not been configured yet.');
    }

    /**
     * Get the length of the TOTP code
     *
     * @return int
     */
    public function getCodeLength(): int
    {
        return (int) $this->config()->get('code_length');
    }
}
