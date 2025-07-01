import { expect, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class DashboardPage extends BasePage {
  readonly pageTitle = this.page.getByTestId("communities-title");
  readonly url = "/";

  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto();
  }

  async verifyLoggedIn() {
    await expect(this.page).toHaveURL(this.url);
  }
}
