import { test, expect } from "@playwright/test";

test.describe("Visual regression", () => {
  test("analytics dashboard matches baseline", async ({ page }) => {
    await page.goto("/");

    // Wait for all data to load
    await expect(page.getByText("Total Users")).toBeVisible();
    await expect(page.getByText("12,847")).toBeVisible();
    await expect(
      page.getByRole("img", { name: "Analytics activity chart" }),
    ).toBeVisible();
    await expect(page.getByText("Recent Activity")).toBeVisible();

    await expect(page).toHaveScreenshot("analytics-dashboard.png", {
      fullPage: true,
    });
  });

  test("settings page matches baseline", async ({ page }) => {
    await page.goto("/settings");

    await expect(page.getByText("Pulse Inc.")).toBeVisible();

    await expect(page).toHaveScreenshot("settings-page.png", {
      fullPage: true,
    });
  });
});
