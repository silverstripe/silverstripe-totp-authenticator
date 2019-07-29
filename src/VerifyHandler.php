<?php declare(strict_types=1);

namespace SilverStripe\TOTP;

use Exception;
use Psr\Log\LoggerInterface;
use RuntimeException;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Core\Injector\Injectable;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\MFA\Exception\AuthenticationFailedException;
use SilverStripe\MFA\Method\Handler\VerifyHandlerInterface;
use SilverStripe\MFA\Model\RegisteredMethod;
use SilverStripe\MFA\Service\EncryptionAdapterInterface;
use SilverStripe\MFA\State\Result;
use SilverStripe\MFA\Store\StoreInterface;

/**
 * Handles verification requests using a time-based one-time password (TOTP) with the silverstripe/mfa module.
 */
class VerifyHandler implements VerifyHandlerInterface
{
    use Injectable;
    use TOTPAware;

    /**
     * @var string[]
     */
    private static $dependencies = [
        'Logger' => '%$' . LoggerInterface::class . '.mfa',
    ];

    /**
     * @var LoggerInterface
     */
    protected $logger;

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

            $this->getLogger()->debug($ex->getMessage(), $ex->getTrace());
        }

        return [
            'enabled' => $enabled,
            'codeLength' => $method->getMethod()->getCodeLength(),
        ];
    }

    public function verify(HTTPRequest $request, StoreInterface $store, RegisteredMethod $registeredMethod): Result
    {
        $data = json_decode($request->getBody(), true);
        if (!$this->getTotp($store)->verify($data['code'] ?? '')) {
            return Result::create(false, _t(__CLASS__ . '.INVALID_CODE', 'Invalid code'));
        }
        return Result::create();
    }

    public function getComponent(): string
    {
        return 'TOTPVerify';
    }

    /**
     * @return LoggerInterface
     */
    public function getLogger(): ?LoggerInterface
    {
        return $this->logger;
    }

    /**
     * @param LoggerInterface $logger
     * @return VerifyHandler
     */
    public function setLogger(LoggerInterface $logger): VerifyHandler
    {
        $this->logger = $logger;
        return $this;
    }
}
