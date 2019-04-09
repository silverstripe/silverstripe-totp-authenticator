<?php declare(strict_types=1);

namespace SilverStripe\TOTP;

use SilverStripe\Control\HTTPRequest;
use SilverStripe\MFA\Method\Handler\LoginHandlerInterface;
use SilverStripe\MFA\Model\RegisteredMethod;
use SilverStripe\MFA\Store\StoreInterface;

/**
 * Handles login requests using a time-based one-time password (TOTP) with the silverstripe/mfa module.
 */
class LoginHandler implements LoginHandlerInterface
{
    public function start(StoreInterface $store, RegisteredMethod $method): array
    {
        // TODO: Implement start() method.
    }

    public function verify(HTTPRequest $request, StoreInterface $store, RegisteredMethod $registeredMethod): bool
    {
        // TODO: Implement verify() method.
    }

    public function getLeadInLabel(): string
    {
        // TODO: Implement getLeadInLabel() method.
    }

    public function getComponent(): string
    {
        // TODO: Implement getComponent() method.
    }
}
