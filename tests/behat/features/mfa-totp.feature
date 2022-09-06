Feature: Use MFA TOTP
  As a website user
  I want to use MFA TOTP

   Background:
    Given the "group" "EDITOR" has permissions "Access to 'Security' section"

    # Login to create user and then logout
    And I am logged in as a member of "EDITOR" group
    And I go to "/Security/login"
    And I press the "Log in as someone else" button
    And I reset has skipped mfa registration for "EDITOR" permissions user

  Scenario: Can skip with MFA is optional
    Given I am logged in with "ADMIN" permissions
    When I go to "/admin/settings"
    And I click the "Access" CMS tab
    And I select the "MFA is optional for everyone" radio button
    And I press the "Save" button
    When I go to "/Security/login"
    And I press the "Log in as someone else" button
    And I log in with "EDITOR@example.org" and "Secret!123" without skipping MFA
    And I should see "Add extra security to your account"
    And I should see "Setup later"

  Scenario: MFA is optional while a grace period is in effect
    Given I am logged in with "ADMIN" permissions
    When I go to "/admin/settings"
    And I click the "Access" CMS tab
    And I select the "MFA is required for everyone" radio button
    # Set date in the future
    And I fill in "Form_EditForm_MFAGracePeriodExpires" with "2030-01-01"
    And I press the "Save" button
    When I go to "/Security/login"
    And I press the "Log in as someone else" button
    And I log in with "EDITOR@example.org" and "Secret!123" without skipping MFA
    And I should see "Add extra security to your account"
    And I should see "Setup later"

  Scenario: MFA is required when a grace period has expired
    Given I am logged in with "ADMIN" permissions
    When I go to "/admin/settings"
    And I click the "Access" CMS tab
    And I select the "MFA is required for everyone" radio button
    # Set date in the past
    And I fill in "Form_EditForm_MFAGracePeriodExpires" with "2020-01-01"
    And I press the "Save" button
    When I go to "/Security/login"
    And I press the "Log in as someone else" button
    And I log in with "EDITOR@example.org" and "Secret!123" without skipping MFA
    And I should see "Add extra security to your account"
    And I should not see "Setup later"

  Scenario: MFA is not shown when user does not have CMS access permissions
    # No CMS permissions group
    Given the "group" "NO_ACCESS group"
    And I am logged in with "NO_ACCESS" permissions
    And I go to "/Security/login"
    And I press the "Log in as someone else" button
    And I reset has skipped mfa registration for "NO_ACCESS" permissions user
    And I log in with "NO_ACCESS@example.org" and "Secret!123" without skipping MFA
    Then I should not see "Add extra security to your account"

  Scenario: User can select a verification method, handles incorrect TOTP codes
    When I log in with "EDITOR@example.org" and "Secret!123" without skipping MFA
    And I press the "Get started" button
    And I should see "Select a verification method"
    When I click on the "img[alt='Authenticator app']" element
    And I press the "Next" button
    # QR code screen
    And I press the "Next" button
    # Enter invalid code
    And I fill in "totp-code" with "FOOBAR"
    And I press the "Next" button
    Then I should see "Provided code was not valid"
    # Next button is disabled
    And I should see a "button.btn-primary[disabled]" element

  Scenario: My profile
    Given I am logged in as a member of "EDITOR" group
    And I add a TOTP method for "EDITOR" permissions user
    And I go to "/admin/myprofile"
    And I scroll to the MFA section
    And I wait for 5 seconds

    # See registered MFA methods
    Then I should see "Authenticator app: Registered"
    And I should see "Recovery codes"

    # Add another MFA method
    When I press the "Add another MFA method" button
    And I wait for 3 seconds
    Then I should see "Select a verification method"
    # close the modal
    When I press the "Back" button

    # Reset method - will show a QR code - should still manually test
    When I press the TOTP authenticator app "Reset" button with javascript
    And I wait for 3 seconds
    Then I should see "Register with authenticator app"
    # close the modal
    When I press the "Back" button

    # Reset recovery code
    When I press the TOTP backup codes "Reset" button with javascript
    And I wait for 1 second
    Then I should see "All existing codes will be made invalid and new codes will be created"
    When I press "Reset codes"
    Then I should see "Copy codes"
    And I press the "Finish" button

    # Can remove if method is MFA is optional
    # Will remove both the TOTP + backup recovery code method
    When I press the TOTP authenticator app "Remove" button with javascript
    And I wait for 1 second
    And I press the "Remove method" button
    Then I should not see a ".registered-method-list-item__control" element

  Scenario: Cannot remove only method if MFA is required
    Given I am logged in as a member of "EDITOR" group
    And I add a TOTP method for "EDITOR" permissions user
    And I set MFA to required
    And I go to "/admin/myprofile"
    And I scroll to the MFA section
    Then I should not see "Remove"

  Scenario: Admin can reset a member's MFA settings
    Given I add a TOTP method for "EDITOR" permissions user
    Given I am logged in with "ADMIN" permissions
    And I go to "/admin/security"
    # Sort by First name DESC
    And I press the "First Name" button
    And I press the "First Name" button
    # Click the first row
    And I click on the ".col-FirstName" element
    And I wait for 5 seconds
    And I scroll to the MFA section
    And I press the "Send account reset email" button
    And I press the "Yes, send reset email" button
    Then I should see "An email has been sent"

  Scenario: Non MFA admin cannot see MFA settings for other Members
    # This EDITOR group has LeftAndMain access, so can access security section
    # but does not have the View/reset MFA configuration for other members permission
    # Login to create user then log out
    Given I am logged in with "ADMIN" permissions
    And I go to "/Security/login"
    And I press the "Log in as someone else" button
    Given I add a TOTP method for "ADMIN" permissions user
    Given I am logged in as a member of "EDITOR" group
    And I go to "/admin/security"
    # Click the first row
    And I click on the ".col-FirstName" element
    And I wait for 5 seconds
    Then I should not see a "#Form_EditForm_MFASettings_Holder" element
    And I should not see a "#Form_ItemEditForm_MFASettings_Holder" element
