<?php declare(strict_types=1);

namespace SilverStripe\TOTP;

use SilverStripe\Core\Config\Configurable;
use SilverStripe\Core\Environment;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Core\Manifest\ModuleLoader;
use SilverStripe\MFA\Method\Handler\VerifyHandlerInterface;
use SilverStripe\MFA\Method\Handler\RegisterHandlerInterface;
use SilverStripe\MFA\Method\MethodInterface;
use SilverStripe\View\Requirements;

/**
 * Enables time-based one-time password (TOTP) authentication for the silverstripe/mfa module.
 */
class Method implements MethodInterface
{
    use Configurable;

    /**
     * The TOTP code length
     *
     * @config
     * @var int
     */
    private static $code_length = 6;

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
        return ModuleLoader::getModule('silverstripe/totp-authenticator')
            ->getResource('client/dist/images/totp.svg')
            ->getURL();
    }

    public function applyRequirements(): void
    {
        Requirements::javascript('silverstripe/totp-authenticator: client/dist/js/bundle.js');
        Requirements::css('silverstripe/totp-authenticator: client/dist/styles/bundle.css');
    }

    /**
     * TOTP authentication is only available if the required environment variable is set to enable encryption.
     *
     * @return bool
     */
    public function isAvailable(): bool
    {
        return !empty(Environment::getEnv('SS_MFA_SECRET_KEY'));
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
