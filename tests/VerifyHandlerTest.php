<?php

namespace SilverStripe\TOTP\Tests;

// phpcs:disable
require_once 'Zend/Log/Writer/Null.php';
// phpcs:enable

use Injector;
use Member;
use MFARegisteredMethod as RegisteredMethod;
use OTPHP\TOTPInterface;
use PHPUnit_Framework_MockObject_MockObject;
use SapphireTest;
use SilverStripe\MFA\Extension\MemberExtension;
use SilverStripe\MFA\Service\EncryptionAdapterInterface;
use SilverStripe\MFA\Store\SessionStore;
use SilverStripe\MFA\Store\StoreInterface;
use SilverStripe\TOTP\Method;
use SilverStripe\TOTP\VerifyHandler;
use SS_HTTPRequest;
use SS_Log;
use Zend_Log_Writer_Null;

class VerifyHandlerTest extends SapphireTest
{
    protected $usesDatabase = true;

    /**
     * @var SS_HTTPRequest
     */
    protected $request;

    /**
     * @var StoreInterface
     */
    protected $store;

    /**
     * @var VerifyHandler
     */
    protected $handler;

    /**
     * @var Member&MemberExtension
     */
    protected $member;

    public function setUp()
    {
        parent::setUp();

        $this->request = new SS_HTTPRequest('GET', '/');
        $this->handler = VerifyHandler::create();

        // Mock environment variable for encryption key
        putenv('SS_MFA_SECRET_KEY=foobar123');

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

        $this->store = new SessionStore($this->member);
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
        putenv('SS_MFA_SECRET_KEY=');
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
        /** @var VerifyHandler&PHPUnit_Framework_MockObject_MockObject $handler */
        $handler = $this->getMockBuilder(VerifyHandler::class)
            ->setMethods(['getTotp'])
            ->getMock();

        $handler->expects($this->once())->method('getTotp')->willReturn(
            $totp = $this->createMock(TOTPInterface::class)
        );
        $totp->expects($this->once())->method('verify')->with('135246')->willReturn(true);

        $result = $handler->verify($this->request, $this->store, $this->member->RegisteredMFAMethods()->first());
        $this->assertTrue(
            $result->isSuccessful(),
            'Mocked TOTP verification with the right argument should return successful result'
        );
    }

    public function testExceptionsOnStartMethodAreLogged()
    {
        putenv('SS_MFA_SECRET_KEY=');

        /** @var Zend_Log_Writer_Null|PHPUnit_Framework_MockObject_MockObject $logger */
        $logger = $this->createMock(Zend_Log_Writer_Null::class);
        $logger->expects($this->once())->method('write');

        $originalWriters = SS_Log::get_writers();
        SS_Log::clear_writers();
        SS_Log::add_writer($logger);

        $this->handler->start($this->store, $this->member->RegisteredMFAMethods()->first());

        SS_Log::remove_writer($logger);
        foreach ($originalWriters as $writer) {
            SS_Log::add_writer($writer);
        }
    }
}
