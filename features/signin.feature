Feature: Sign in

  Background:
    Given User navigates to the sign in page

  @smoke
  Scenario: Buyer signs in successfully
    Given the login API accepts valid buyer credentials
    When User enters email "Buyer@mail.com"
    And User enters password "Buyer@itbm1"
    And User clicks the Sign In button
    Then User should be redirected to the sale item gallery

  Scenario: Sign in button is disabled when form is incomplete
    Then the Sign In button should be disabled

  Scenario: User enters invalid credentials
    Given the login API rejects the credentials
    When User enters email "wrong@example.com"
    And User enters password "wrong-password"
    And User clicks the Sign In button
    Then User should see the sign in message "Email or Password is incorrect."

  Scenario: Sign in button remains disabled when password is empty
    When User enters email "buyer@example.com"
    Then the Sign In button should be disabled

  Scenario: Sign in button remains disabled when email is empty
    When User enters password "password123"
    Then the Sign In button should be disabled