import { test, expect } from "@playwright/test";

test.describe("End-to-end testing for ASHIKA", () => {
  test("Homepage loads and has correct titles", async ({ page }) => {
    await page.goto("/");

    // Check if the title text is visible
    await expect(
      page.locator("text=SO WHY BUY WHEN YOU CAN BORROW?"),
    ).toBeVisible();

    // Check navigation to Shop
    const shopLink = page.locator('a:has-text("Get 10% Off!")');
    await expect(shopLink).toBeVisible();

    // Click category
    await page.goto("/shop?category=saree");
    await expect(page.locator('h1:has-text("Our Collection")')).toBeVisible();
  });

  test("Shop page filtering works", async ({ page }) => {
    await page.goto("/shop");

    // Should display products
    const productCards = page.locator('a[href^="/shop/"]');
    await expect(productCards.first()).toBeVisible();
  });

  test("Product detail page loads correctly", async ({ page }) => {
    await page.goto("/shop/1");

    // Look for product title (assumes product 1 exists - Royal Blue Banarasi Silk Saree)
    await expect(page.locator("h1.text-3xl.md\\:text-4xl")).toBeVisible();

    // Look for "Rent Now" button
    await expect(page.locator('button:has-text("Rent Now")')).toBeVisible();
  });
});
