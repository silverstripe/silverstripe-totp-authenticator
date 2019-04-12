<?php

namespace SilverStripe\TOTP\Tests;

use OTPHP\TOTPInterface;
use PHPUnit_Framework_MockObject_MockObject;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\Session;
use SilverStripe\Core\Environment;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Dev\SapphireTest;
use SilverStripe\MFA\Extension\MemberExtension;
use SilverStripe\MFA\Model\RegisteredMethod;
use SilverStripe\MFA\Service\EncryptionAdapterInterface;
use SilverStripe\MFA\Store\SessionStore;
use SilverStripe\MFA\Store\StoreInterface;
use SilverStripe\Security\Member;
use SilverStripe\TOTP\LoginHandler;
use SilverStripe\TOTP\Method;

class LoginHandlerTest extends SapphireTest
{
    protected $usesDatabase = true;

    /**
     * @var HTTPRequest
     */
    protected $request;

    /**
     * @var StoreInterface
     */
    protected $store;

    /**
     * @var LoginHandler
     */
    protected $handler;

    /**
     * @var Member&MemberExtension
     */
    protected $member;

    protected function setUp()
    {
        parent::setUp();

        $this->request = new HTTPRequest('GET', '/');
        $this->request->setSession(new Session([]));
        $this->store = new SessionStore($this->request);
        $this->handler = new LoginHandler();

        // Mock environment variable for encryption key
        Environment::setEnv('SS_MFA_SECRET_KEY', 'foobar123');

        // Mock the encryption adapter to return the plaintext input
        $encryptionAdapter = $this->createMock(EncryptionAdapterInterface::class);
        $encryptionAdapter->expects($this->any())->method('decrypt')->willReturnArgument(0);
        Injector::inst()->registerService($encryptionAdapter, EncryptionAdapterInterface::class);

        // Create a registered method and attach it to the member
        $registeredMethod = new RegisteredMethod();
        $registeredMethod->MethodClassName = Method::class;
        $registeredMethod->Data = json_encode(['secret' => 'ABCD1234']);
        $registeredMethod->write();

        $memberID = $this->logInWithPermission();
        $this->member = Member::get()->byID($memberID);
        $this->member->RegisteredMFAMethods()->add($registeredMethod);
    }

    public function testStartWithNoSecret()
    {
        $method = $this->member->RegisteredMFAMethods()->first();
        $method->Data = json_encode([]);
        $method->write();

        $result = $this->handler->start($this->store, $method);
        $this->assertFalse($result['enabled']);
    }

    public function testStartWithNoEncryptionKey()
    {
        Environment::setEnv('SS_MFA_SECRET_KEY', '');
        $result = $this->handler->start($this->store, $this->member->RegisteredMFAMethods()->first());
        $this->assertFalse($result['enabled']);
    }

    public function testStartSuccess()
    {
        $result = $this->handler->start($this->store, $this->member->RegisteredMFAMethods()->first());
        $this->assertTrue($result['enabled']);
        $this->assertGreaterThan(1, $result['codeLength']);
        $this->assertSame('ABCD1234', $this->store->getState()['secret']);
    }

    public function testVerify()
    {
        $this->request->setBody(json_encode(['code' => '135246']));
        /** @var LoginHandler&PHPUnit_Framework_MockObject_MockObject $handler */
        $handler = $this->getMockBuilder(LoginHandler::class)
            ->setMethods(['getTotp'])
            ->getMock();

        $handler->expects($this->once())->method('getTotp')->willReturn(
            $totp = $this->createMock(TOTPInterface::class)
        );
        $totp->expects($this->once())->method('verify')->with('135246')->willReturn(true);

        $result = $handler->verify($this->request, $this->store, $this->member->RegisteredMFAMethods()->first());
        $this->assertTrue($result, 'Mocked TOTP verification with the right argument should return true');
    }
}
