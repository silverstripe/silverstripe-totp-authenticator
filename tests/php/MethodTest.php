<?php

namespace SilverStripe\TOTP\Tests;

use SilverStripe\Core\Environment;
use SilverStripe\Dev\SapphireTest;
use SilverStripe\TOTP\Method;

class MethodTest extends SapphireTest
{
    protected function setUp(): void
    {
        parent::setUp();

        Method::config()->set('code_length', 6);
    }

    public function testIsAvailable()
    {
        $method = new Method();

        Environment::setEnv('SS_MFA_SECRET_KEY', '');
        $this->assertFalse($method->isAvailable());

        Environment::setEnv('SS_MFA_SECRET_KEY', 'foo123');
        $this->assertTrue($method->isAvailable());
    }

    public function testDefaultTotpCodeLength()
    {
        $method = new Method();
        $this->assertSame(6, $method->getCodeLength(), 'Default code length should be 6');
    }
}
