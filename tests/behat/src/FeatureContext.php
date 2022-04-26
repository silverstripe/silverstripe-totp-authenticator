<?php

namespace SilverStripe\TOTP\Tests\Behat\Context;

use SilverStripe\BehatExtension\Context\SilverStripeContext;

class FeatureContext extends SilverStripeContext
{
    /**
     * @Given /^I scroll to the MFA section$/
     */
    public function iScrollToTheMfaSection()
    {
        $selector = '#Form_EditForm_MFASettings_Holder,#Form_ItemEditForm_MFASettings_Holder';
        $js = "document.querySelector('$selector').scrollIntoView();";
        $this->getSession()->executeScript($js);
    }

    /**
     * Assumes a single registered totp device + backup codes
     *
     * @Given /^I press the TOTP authenticator app "(.+?)" button with javascript$/
     * @param string $button - Reset | Remove
     */
    public function iPressTheAuthenticatorAppButton($button)
    {
        $this->pressMfaButton('Authenticator app', $button);
    }

    /**
     * Assumes a single registered totp device + backup codes
     *
     * @Given /^I press the TOTP backup codes "(.+?)" button with javascript$/
     * @param string $button - Reset | Remove
     */
    public function iPressTheBackupCodesButton($button)
    {
        $this->pressMfaButton('Recovery codes', $button);
    }

    /**
     * @param string $section - Authenticator app | Recovery codes
     * @param string $button - Reset | Remove
     */
    private function pressMfaButton($section, $button)
    {
        $section = str_replace("'", "\\'", $section ?? '');
        $button = str_replace("'", "\\'", $button ?? '');
        $js = <<<JS
            document.querySelectorAll('.registered-method-list-item').forEach(el => {
                if (!el.innerHTML.includes('{$section}')) {
                    return;
                }
                el.querySelectorAll('button').forEach(button => {
                    if (!button.innerHTML.includes('{$button}')) {
                        return;
                    }
                    button.click();
                });
            });
JS;
        $this->getSession()->executeScript($js);
    }
}
