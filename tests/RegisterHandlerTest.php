<?php

namespace SilverStripe\TOTP\Tests;

use Member;
use OTPHP\TOTP;
use OTPHP\TOTPInterface;
use PHPUnit_Framework_MockObject_MockObject;
use SapphireTest;
use SilverStripe\MFA\Store\SessionStore;
use SilverStripe\MFA\Store\StoreInterface;
use SilverStripe\TOTP\RegisterHandler;
use SiteConfig;
use SS_HTTPRequest;

class RegisterHandlerTest extends SapphireTest
{
    protected $usesDatabase = true;

    /**
     * @var RegisterHandler
     */
    protected $handler;

    /**
     * @var Member
     */
    protected $member;

    public function setUp()
    {
        parent::setUp();

        $this->handler = new RegisterHandler();

        putenv('SS_MFA_SECRET_KEY=foo123');

        $memberID = $this->logInWithPermission();
        /** @var Member $member */
        $this->member = Member::get()->byID($memberID);
    }

    public function testStart()
    {
        $store = new SessionStore($this->member);
        $result = $this->handler->start($store);

        $this->assertTrue($result['enabled'], 'Method should be enabled');
        $this->assertContains(
            rawurlencode(SiteConfig::current_site_config()->Title),
            $result['uri'],
            'Site name should be stored in provisioning URI'
        );
        $this->assertContains(
            rawurlencode($this->member->Email),
            $result['uri'],
            'Provisioning URI should contain user email'
        );
        $this->assertNotEmpty(
            $store->getState()['secret'],
            'TOTP secret should be saved to StoreInterface'
        );
    }

    public function testRegisterWithInvalidCode()
    {
        $request = new SS_HTTPRequest('GET', '/', [], [], json_encode(['code' => '123456']));
        $store = new SessionStore($this->member);
        $store->setState(['secret' => base64_encode('willneverw0rk')]);

        $result = $this->handler->register($request, $store);
        $this->assertFalse($result->isSuccessful());
        $this->assertSame(
            'Provided code was not valid',
            $result->getMessage(),
            'Registration failure message is provided'
        );
    }

    public function testRegisterReturnsEncryptedSecret()
    {
        $request = new SS_HTTPRequest('GET', '/', [], [], json_encode(['code' => '123456']));
        $store = new SessionStore($this->member);
        $store->setState(['secret' => 'opensesame']);

        /** @var RegisterHandler|PHPUnit_Framework_MockObject_MockObject $handler */
        $handler = $this->getMockBuilder(RegisterHandler::class)
            ->setMethods(['getTotp'])
            ->getMock();
        $handler->expects($this->once())->method('getTotp')->willReturn(
            /** @var TOTP|PHPUnit_Framework_MockObject_MockObject $totpMock */
            $totpMock = $this->createMock(TOTPInterface::class)
        );
        $totpMock->expects($this->once())->method('verify')->with('123456')->willReturn(true);

        $result = $handler->register($request, $store);
        $context = $result->getContext();
        $this->assertNotEmpty($context['secret']);
        $this->assertNotContains(
            'opensesame',
            $context['secret'],
            'Encrypted secret should not contain the plain text secret'
        );
    }
}
