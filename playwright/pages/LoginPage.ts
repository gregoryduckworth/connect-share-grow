import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { DashboardPage } from "./DashboardPage";

export class LoginPage extends BasePage {
  readonly emailInput = this.page.getByTestId("login-email-input");
  readonly passwordInput = this.page.getByTestId("login-password-input");
  readonly submitButton = this.page.getByTestId("login-submit-btn");
  readonly url = "/login";

  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto();
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    return new DashboardPage(this.page);
  }
}
