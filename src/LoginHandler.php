<?php declare(strict_types=1);

namespace SilverStripe\TOTP;

use Exception;
use RuntimeException;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\MFA\Exception\AuthenticationFailedException;
use SilverStripe\MFA\Method\Handler\LoginHandlerInterface;
use SilverStripe\MFA\Model\RegisteredMethod;
use SilverStripe\MFA\Service\EncryptionAdapterInterface;
use SilverStripe\MFA\Store\StoreInterface;

/**
 * Handles login requests using a time-based one-time password (TOTP) with the silverstripe/mfa module.
 */
class LoginHandler implements LoginHandlerInterface
{
    use TOTPAware;

    public function start(StoreInterface $store, RegisteredMethod $method): array
    {
        try {
            $data = json_decode($method->Data, true);
            if (!$data || !isset($data['secret'])) {
                throw new RuntimeException('TOTP secret is not available in the StoreInterface');
            }

            $key = $this->getEncryptionKey();
            if (empty($key)) {
                throw new AuthenticationFailedException(
                    'Please define a SS_MFA_SECRET_KEY environment variable for encryption'
                );
            }

            // Decrypt the TOTP secret from the registered method
            $secret = Injector::inst()->get(EncryptionAdapterInterface::class)->decrypt($data['secret'], $key);

            $store->setState([
                'secret' => $secret,
            ]);

            $enabled = true;
        } catch (Exception $ex) {
            // noop: encryption may not be defined, so method should be disabled rather than application error
            $enabled = false;
        }

        return [
            'enabled' => $enabled,
            'codeLength' => $method->getMethod()->getCodeLength(),
        ];
    }

    public function verify(HTTPRequest $request, StoreInterface $store, RegisteredMethod $registeredMethod): bool
    {
        $data = json_decode($request->getBody(), true);
        return $this->getTotp($store)->verify($data['code'] ?? '');
    }

    public function getLeadInLabel(): string
    {
        return _t(__CLASS__ . '.NAME', 'Verify with authenticator app');
    }

    public function getComponent(): string
    {
        return 'TOTPLogin';
    }
}
