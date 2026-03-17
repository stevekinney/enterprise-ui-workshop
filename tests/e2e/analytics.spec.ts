import { test, expect } from "@playwright/test";

test.describe("Analytics with mocked API", () => {
  test("renders analytics data from MSW handlers", async ({ page }) => {
    await page.goto("/");

    // Verify the MSW mock data renders
    await expect(page.getByText("Total Users")).toBeVisible();
    await expect(page.getByText("12,847")).toBeVisible();
    await expect(page.getByText("3,291")).toBeVisible();
    await expect(page.getByText("$284,100")).toBeVisible();
    await expect(page.getByText("3.2%")).toBeVisible();
  });

  test("chart time range toggles work", async ({ page }) => {
    await page.goto("/");

    // Wait for chart to load
    await expect(
      page.getByRole("img", { name: "Analytics activity chart" }),
    ).toBeVisible();

    // Click 7d toggle
    await page.getByRole("button", { name: "7d" }).click();

    // Chart should still be visible after toggle
    await expect(
      page.getByRole("img", { name: "Analytics activity chart" }),
    ).toBeVisible();
  });

  test.skip("record HAR fixture", async ({ page }) => {
    // Start recording all API calls
    await page.routeFromHAR("tests/fixtures/analytics-summary.har", {
      update: true,
      url: "**/api/analytics/**",
    });

    await page.goto("/");

    // Wait for all analytics data to load
    await expect(page.getByText("Total Users")).toBeVisible();
    await expect(page.getByText("12,847")).toBeVisible();

    // Close the page to flush the HAR file
    await page.close();
  });

  test("renders analytics from HAR fixture", async ({ page }) => {
    // Replay recorded responses instead of hitting the live API
    await page.routeFromHAR("tests/fixtures/analytics-summary.har", {
      update: false,
      url: "**/api/analytics/**",
    });

    await page.goto("/");

    // These values come from the recorded HAR, not the live MSW handlers
    await expect(page.getByText("Total Users")).toBeVisible();
    await expect(page.getByText("12,847")).toBeVisible();
  });
});
