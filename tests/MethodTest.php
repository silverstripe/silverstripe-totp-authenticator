<?php

namespace SilverStripe\TOTP\Tests;

use SilverStripe\Core\Environment;
use SilverStripe\Dev\SapphireTest;
use SilverStripe\TOTP\Method;

class MethodTest extends SapphireTest
{
    public function testIsAvailable()
    {
        $method = new Method();

        Environment::setEnv('SS_MFA_SECRET_KEY', '');
        $this->assertFalse($method->isAvailable());

        Environment::setEnv('SS_MFA_SECRET_KEY', 'foo123');
        $this->assertTrue($method->isAvailable());
    }
}
