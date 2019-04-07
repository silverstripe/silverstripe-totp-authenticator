<?php

namespace SilverStripe\TOTP;

use SilverStripe\Control\HTTPRequest;
use SilverStripe\MFA\Method\Handler\RegisterHandlerInterface;
use SilverStripe\MFA\Store\StoreInterface;

/**
 * Handles registration requests using a time-based one-time password (TOTP) with the silverstripe/mfa module.
 */
class RegisterHandler implements RegisterHandlerInterface
{
    public function start(StoreInterface $store)
    {
        // TODO: Implement start() method.
    }

    public function register(HTTPRequest $request, StoreInterface $store)
    {
        // TODO: Implement register() method.
    }

    public function getName()
    {
        // TODO: Implement getName() method.
    }

    public function getDescription()
    {
        // TODO: Implement getDescription() method.
    }

    public function getSupportLink()
    {
        // TODO: Implement getSupportLink() method.
    }

    public function getComponent()
    {
        // TODO: Implement getComponent() method.
    }
}
