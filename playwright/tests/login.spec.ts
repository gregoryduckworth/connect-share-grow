import { test } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

test.describe("Login Page Tests", () => {
  test("should be able to login", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    const dashboardPage = await loginPage.login(
      "admin@example.com",
      "password123"
    );
    await dashboardPage.verifyLoggedIn();
  });
});
