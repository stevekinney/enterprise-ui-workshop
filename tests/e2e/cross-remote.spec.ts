import { test, expect } from "@playwright/test";

test.describe("Cross-route navigation", () => {
  test("navigates from analytics to users and back", async ({ page }) => {
    await page.goto("/");

    // Wait for the stats bar to render (fastest API response at 200ms)
    await expect(page.getByText("Total Users")).toBeVisible();
    await expect(page.getByText("12,847")).toBeVisible();

    // Navigate to users
    await page.getByRole("link", { name: "Users" }).click();

    // Wait for the user list to render
    await expect(page.getByText("Alan Turing")).toBeVisible();

    // Navigate back to analytics
    await page.getByRole("link", { name: "Analytics" }).click();

    // Verify analytics data is still present
    await expect(page.getByText("Total Users")).toBeVisible();
    await expect(page.getByText("12,847")).toBeVisible();
  });

  test("users page shows user data with roles", async ({ page }) => {
    await page.goto("/");

    // Navigate to users
    await page.getByRole("link", { name: "Users" }).click();

    // Wait for user list to load
    await expect(page.getByText("Alan Turing")).toBeVisible();

    // Verify user data is visible in the table
    await expect(page.getByText("grace@pulse.dev")).toBeVisible();

    // Verify we can navigate back
    await expect(page.getByRole("link", { name: "Analytics" })).toBeVisible();
  });

  test("settings page loads with organization data", async ({ page }) => {
    await page.goto("/settings");

    // Wait for settings data to load
    await expect(page.getByText("Pulse Inc.")).toBeVisible();
    await expect(page.getByText("pro")).toBeVisible();
  });
});
