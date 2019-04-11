<?php

namespace SilverStripe\TOTP\Tests;

use OTPHP\TOTP;
use OTPHP\TOTPInterface;
use PHPUnit_Framework_MockObject_MockObject;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Core\Environment;
use SilverStripe\Dev\SapphireTest;
use SilverStripe\MFA\Store\SessionStore;
use SilverStripe\MFA\Store\StoreInterface;
use SilverStripe\Security\Member;
use SilverStripe\SiteConfig\SiteConfig;
use SilverStripe\TOTP\RegisterHandler;

class RegisterHandlerTest extends SapphireTest
{
    protected $usesDatabase = true;

    /**
     * @var RegisterHandler
     */
    protected $handler;

    /**
     * @var StoreInterface
     */
    protected $store;

    /**
     * @var Member
     */
    protected $member;

    protected function setUp()
    {
        parent::setUp();

        $this->handler = new RegisterHandler();

        Environment::setEnv('SS_MFA_SECRET_KEY', 'foo123');

        $memberID = $this->logInWithPermission();
        /** @var Member $member */
        $this->member = Member::get()->byID($memberID);
        $this->store = new SessionStore($this->member);
    }

    public function testStart()
    {
        $result = $this->handler->start($this->store);

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
            $this->store->getState()['secret'],
            'TOTP secret should be saved to StoreInterface'
        );
    }

    /**
     * @expectedException \SilverStripe\MFA\Exception\AuthenticationFailedException
     * @expectedExceptionMessage Provided code was not valid.
     */
    public function testRegisterWithInvalidCode()
    {
        $request = new HTTPRequest('GET', '/', [], [], json_encode(['code' => '123456']));
        $this->store->setState(['secret' => base64_encode('willneverw0rk')]);
        $this->handler->register($request, $this->store);
    }

    public function testRegisterReturnsEncryptedSecret()
    {
        $request = new HTTPRequest('GET', '/', [], [], json_encode(['code' => '123456']));
        $this->store->setState(['secret' => 'opensesame']);

        /** @var RegisterHandler|PHPUnit_Framework_MockObject_MockObject $handler */
        $handler = $this->getMockBuilder(RegisterHandler::class)
            ->setMethods(['getTotp'])
            ->getMock();
        $handler->expects($this->once())->method('getTotp')->willReturn(
            /** @var TOTP|PHPUnit_Framework_MockObject_MockObject $totpMock */
            $totpMock = $this->createMock(TOTPInterface::class)
        );
        $totpMock->expects($this->once())->method('verify')->with('123456')->willReturn(true);

        $result = $handler->register($request, $this->store);
        $this->assertNotEmpty($result['secret']);
        $this->assertNotContains(
            'opensesame',
            $result['secret'],
            'Encrypted secret should not contain the plain text secret'
        );
    }
}
