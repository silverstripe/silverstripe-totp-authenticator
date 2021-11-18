<?php

namespace SilverStripe\TOTP\Tests\Behat\Context;

use SilverStripe\BehatExtension\Context\FixtureContext as BaseFixtureContext;
use SilverStripe\Security\Member;
use SilverStripe\MFA\Model\RegisteredMethod;
use SilverStripe\TOTP\Method as TOTPMethod;
use SilverStripe\MFA\BackupCode\Method as BackupCodeMethod;
use SilverStripe\SiteConfig\SiteConfig;
use PHPUnit\Framework\Assert;

class FixtureContext extends BaseFixtureContext
{
    /**
     * @Given /^I reset has skipped mfa registration for "([^"]*)" permissions user/
     * @param string $permCode
     */
    public function iResetHasSkippedMFARegistration($permCode)
    {
        $member = Member::get()->find('Email', "{$permCode}@example.org");
        Assert::assertNotNull($member, "Member with perm code {$permCode} was null");
        $member->HasSkippedMFARegistration = 0;
        $member->write();
    }

    /**
     * Used to add TOTP methods to members since behat is unable to scan
     * a QR code with a mobile phone
     *
     * Call this AFTER logging in as member
     *
     * @Given /^I add a TOTP method for "([^"]*)" permissions user/
     * @param string $permCode
     */
    public function iAddATotpMethod($permCode)
    {
        $member = Member::get()->find('Email', "{$permCode}@example.org");
        Assert::assertNotNull($member, "Member with perm code {$permCode} was null");
        RegisteredMethod::create([
            'MethodClassName' => TOTPMethod::class,
            'Member' => $member->ID,
        ])->write();
        RegisteredMethod::create([
            'MethodClassName' => BackupCodeMethod::class,
            'Member' => $member->ID
        ])->write();
    }

    /**
     * @Given /^I set MFA to required$/
     */
    public function iSetMfaToRequired()
    {
        $config = SiteConfig::current_site_config();
        $config->MFARequired = true;
        $config->write();
    }
}
