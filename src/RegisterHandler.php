<?php

declare(strict_types=1);

namespace SilverStripe\TOTP;

use ParagonIE\ConstantTime\Base32;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Core\Config\Configurable;
use SilverStripe\Core\Environment;
use SilverStripe\Core\Extensible;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\MFA\Exception\AuthenticationFailedException;
use SilverStripe\MFA\Method\Handler\RegisterHandlerInterface;
use SilverStripe\MFA\Service\EncryptionAdapterInterface;
use SilverStripe\MFA\State\Result;
use SilverStripe\MFA\Store\StoreInterface;
use SilverStripe\Security\Member;
use SilverStripe\Security\Security;
use SilverStripe\SiteConfig\SiteConfig;

/**
 * Handles registration requests using a time-based one-time password (TOTP) with the silverstripe/mfa module.
 */
class RegisterHandler implements RegisterHandlerInterface
{
    use Configurable;
    use Extensible;
    use TOTPAware;

    /**
     * The link to SilverStripe user help documentation for this authenticator.
     *
     * @config
     * @var string
     */
    private static $user_help_link = 'https://servicedesk.nz.silverstripe.cloud/support/solutions/articles/75000042800-setting-up-mfa-with-an-authenticator-app'; // phpcs:ignore

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
            $uniqueIdentifier = (string) Member::config()->get('unique_identifier_field');
            $totp->setLabel($member->{$uniqueIdentifier});
        }
        $totp->setIssuer(SiteConfig::current_site_config()->Title);

        $this->extend('updateTotp', $totp, $member);

        return [
            'enabled' => !empty(Environment::getEnv('SS_MFA_SECRET_KEY')),
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
     * @param HTTPRequest $request
     * @param StoreInterface $store
     * @return Result
     * @throws AuthenticationFailedException
     */
    public function register(HTTPRequest $request, StoreInterface $store): Result
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
