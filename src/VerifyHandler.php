<?php declare(strict_types=1);

namespace SilverStripe\TOTP;

use Exception;
use Injector;
use RuntimeException;
use SilverStripe\MFA\Exception\AuthenticationFailedException;
use SilverStripe\MFA\Method\Handler\VerifyHandlerInterface;
use MFARegisteredMethod as RegisteredMethod;
use SilverStripe\MFA\Service\EncryptionAdapterInterface;
use SilverStripe\MFA\State\Result;
use SilverStripe\MFA\Store\StoreInterface;
use SS_HTTPRequest;
use SS_Log;
use SS_Object;

/**
 * Handles verification requests using a time-based one-time password (TOTP) with the silverstripe/mfa module.
 */
class VerifyHandler extends SS_Object implements VerifyHandlerInterface
{
    use TOTPAware;

    public function start(StoreInterface $store, RegisteredMethod $method): array
    {
        try {
            $data = json_decode((string) $method->Data, true);
            if (!$data || !isset($data['secret'])) {
                throw new RuntimeException('TOTP secret is not available in the registered method data');
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
            SS_Log::log($ex, SS_Log::DEBUG);
        }

        return [
            'enabled' => $enabled,
            'codeLength' => $method->getMethod()->getCodeLength(),
        ];
    }

    public function verify(SS_HTTPRequest $request, StoreInterface $store, RegisteredMethod $registeredMethod): Result
    {
        $data = json_decode($request->getBody(), true);
        if (!$this->getTotp($store)->verify($data['code'] ?? '')) {
            return Result::create(false, _t(__CLASS__ . '.INVALID_CODE', 'Invalid code'));
        }
        return Result::create();
    }

    public function getLeadInLabel(): string
    {
        return _t(__CLASS__ . '.NAME', 'Verify with authenticator app');
    }

    public function getComponent(): string
    {
        return 'TOTPVerify';
    }
}
