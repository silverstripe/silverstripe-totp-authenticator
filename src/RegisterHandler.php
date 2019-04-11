<?php declare(strict_types=1);

namespace SilverStripe\TOTP;

use Exception;
use ParagonIE\ConstantTime\Base32;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Core\Config\Configurable;
use SilverStripe\Core\Environment;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\MFA\Exception\AuthenticationFailedException;
use SilverStripe\MFA\Method\Handler\RegisterHandlerInterface;
use SilverStripe\MFA\Service\EncryptionAdapterInterface;
use SilverStripe\MFA\Store\StoreInterface;
use SilverStripe\SiteConfig\SiteConfig;

/**
 * Handles registration requests using a time-based one-time password (TOTP) with the silverstripe/mfa module.
 */
class RegisterHandler implements RegisterHandlerInterface
{
    use Configurable;
    use TOTPAware;

    /**
     * The link to SilverStripe user help documentation for this authenticator.
     * @todo add it
     *
     * @config
     * @var string
     */
    private static $user_help_link = '';

    /**
     * The desired length of the TOTP secret. This affects the UI, since it is displayed to the user to be entered
     * manually if they cannot scan the QR code.
     *
     * @config
     * @var int
     */
    private static $secret_length = 16;

    public function start(StoreInterface $store): array
    {
        $store->setState([
            'secret' => $this->generateSecret(),
        ]);

        $totp = $this->getTotp($store);

        $totp->setLabel($store->getMember()->Email);
        $totp->setIssuer(SiteConfig::current_site_config()->Title);

        return [
            'enabled' => $this->isAvailable(),
            'uri' => $totp->getProvisioningUri(),
            'code' => $totp->getSecret(),
        ];
    }

    /**
     * Generates a TOTP secret to the configured maximum length
     *
     * @return string
     */
    protected function generateSecret(): string
    {
        $length = $this->config()->get('secret_length');
        return substr(trim(Base32::encodeUpper(random_bytes(64)), '='), 0, $length);
    }

    /**
     * Validate the provided TOTP code and return the TOTP secret to be stored against the RegisteredMethod model.
     * Will throw an exception if the code is invalid.
     *
     * @param HTTPRequest $request
     * @param StoreInterface $store
     * @return array
     * @throws AuthenticationFailedException
     */
    public function register(HTTPRequest $request, StoreInterface $store): array
    {
        $data = json_decode($request->getBody(), true);
        $result = $this->getTotp($store)->verify($data['code'] ?? '');
        if (!$result) {
            throw new AuthenticationFailedException('Provided code was not valid.');
        }

        $key = $this->getEncryptionKey();
        if (empty($key)) {
            throw new AuthenticationFailedException(
                'Please define a SS_MFA_SECRET_KEY environment variable for encryption'
            );
        }

        // Encrypt the TOTP secret before storing it
        $secret = Injector::inst()->get(EncryptionAdapterInterface::class)->encrypt(
            $store->getState()['secret'],
            $key
        );

        return ['secret' => $secret];
    }

    public function getName(): string
    {
        return _t(__CLASS__ . '.NAME', 'Setup via authenticator app');
    }

    public function getDescription(): string
    {
        return _t(
            __CLASS__ . '.DESCRIPTION',
            'Use an authentication app such as Google Authenticator to scan the following code'
        );
    }

    public function getSupportLink(): string
    {
        return (string) $this->config()->get('user_help_link');
    }

    public function getComponent(): string
    {
        return 'TOTPRegister';
    }

    /**
     * TOTP authentication is only available if the required environment variable is set to enable encryption.
     *
     * @return bool
     */
    public function isAvailable(): bool
    {
        return !empty($this->getEncryptionKey());
    }

    public function getUnavailableMessage(): string
    {
        return _t(__CLASS__ . '.NOT_CONFIGURED', 'This method has not been configured yet.');
    }
}
