<?php

namespace SilverStripe\TOTP;

use SilverStripe\Core\Injector\Injector;
use SilverStripe\Core\Manifest\ModuleLoader;
use SilverStripe\MFA\Method\Handler\LoginHandlerInterface;
use SilverStripe\MFA\Method\Handler\RegisterHandlerInterface;
use SilverStripe\MFA\Method\MethodInterface;
use SilverStripe\MFA\State\AvailableMethodDetailsInterface;
use SilverStripe\View\Requirements;

/**
 * Enables time-based one-time password (TOTP) authentication for the silverstripe/mfa module.
 */
class Method implements MethodInterface
{
    public function getURLSegment()
    {
        return 'totp';
    }

    public function getLoginHandler()
    {
        return Injector::inst()->create(LoginHandler::class);
    }

    public function getRegisterHandler()
    {
        return Injector::inst()->create(RegisterHandler::class);
    }

    public function getThumbnail()
    {
        return ModuleLoader::getModule('silverstripe/totp-authenticator')
            ->getResource('client/dist/images/totp.svg')
            ->getURL();
    }

    public function applyRequirements()
    {
        Requirements::javascript('silverstripe/totp-authenticator: client/dist/js/bundle.js');
        Requirements::css('silverstripe/totp-authenticator: client/dist/styles/bundle.css');
    }

    public function getDetails()
    {
        return Injector::inst()->create(AvailableMethodDetailsInterface::class, $this);
    }
}
