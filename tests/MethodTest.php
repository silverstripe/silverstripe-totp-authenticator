<?php

namespace SilverStripe\TOTP\Tests;

use SapphireTest;
use SilverStripe\TOTP\Method;

class MethodTest extends SapphireTest
{
    public function setUp()
    {
        parent::setUp();

        Method::config()->code_length = 6;
    }

    public function testIsAvailable()
    {
        $method = new Method();

        putenv('SS_MFA_SECRET_KEY=');
        $this->assertFalse($method->isAvailable());

        putenv('SS_MFA_SECRET_KEY=foo123');
        $this->assertTrue($method->isAvailable());
    }

    public function testDefaultTotpCodeLength()
    {
        $method = new Method();
        $this->assertSame(6, $method->getCodeLength(), 'Default code length should be 6');
    }
}
