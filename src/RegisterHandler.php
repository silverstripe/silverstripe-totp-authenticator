<?php declare(strict_types=1);

namespace SilverStripe\TOTP;

use Injector;
use ParagonIE\ConstantTime\Base32;
use Security;
use SilverStripe\MFA\Exception\AuthenticationFailedException;
use SilverStripe\MFA\Method\Handler\RegisterHandlerInterface;
use SilverStripe\MFA\Service\EncryptionAdapterInterface;
use SilverStripe\MFA\State\Result;
use SilverStripe\MFA\Store\StoreInterface;
use SiteConfig;
use SS_HTTPRequest;
use SS_Object;

/**
 * Handles registration requests using a time-based one-time password (TOTP) with the silverstripe/mfa module.
 */
class RegisterHandler extends SS_Object implements RegisterHandlerInterface
{
    use TOTPAware;

    /**
     * The link to SilverStripe user help documentation for this authenticator.
     *
     * @config
     * @var string
     */
    private static $user_help_link = 'https://userhelp.silverstripe.org/en/4/optional_features/multi-factor_authentication/user_manual/using_authenticator_apps/'; // phpcs-disable-line

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

        $member = $store->getMember() ?: Security::getCurrentUser();
        if ($member) {
            $totp->setLabel($member->Email);
        }
        $totp->setIssuer(SiteConfig::current_site_config()->Title);

        $secretKey = SecretKeyLoader::singleton()->get();
        return [
            'enabled' => !empty($secretKey),
            'uri' => $totp->getProvisioningUri(),
            'code' => $totp->getSecret(),
            'codeLength' => Injector::inst()->create(Method::class)->getCodeLength(),
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
     * @param SS_HTTPRequest $request
     * @param StoreInterface $store
     * @return Result
     * @throws AuthenticationFailedException
     */
    public function register(SS_HTTPRequest $request, StoreInterface $store): Result
    {
        $data = json_decode($request->getBody(), true);
        $result = $this->getTotp($store)->verify($data['code'] ?? '');
        if (!$result) {
            return Result::create(false, _t(__CLASS__ . '.INVALID_CODE', 'Provided code was not valid'));
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

        return Result::create()->setContext(['secret' => $secret]);
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

    public function getSupportText(): string
    {
        return _t(__CLASS__ . '.SUPPORT_LINK_DESCRIPTION', 'How to use authenticator apps.');
    }

    public function getComponent(): string
    {
        return 'TOTPRegister';
    }
}
