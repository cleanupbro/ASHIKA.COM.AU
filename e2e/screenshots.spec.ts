import { test, expect } from "@playwright/test";
import path from "path";

const SCREENSHOT_DIR = path.join(process.cwd(), "client-handover", "screenshots");

test.describe("Client Handover Screenshots", () => {
  // Use a slightly larger viewport to get nice screenshots
  test.use({ viewport: { width: 1440, height: 900 } });

  test("Capture Homepage", async ({ page }) => {
    await page.goto("/");
    // Wait for hero video and images to load
    await page.waitForTimeout(2000); 
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "01-homepage.png"), fullPage: true });
  });

  test("Capture Shop Page", async ({ page }) => {
    await page.goto("/shop");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "02-shop.png"), fullPage: true });
  });

  test("Capture Category: Sarees", async ({ page }) => {
    await page.goto("/shop?category=saree");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "03-category-sarees.png"), fullPage: true });
  });

  test("Capture Category: Lehengas", async ({ page }) => {
    await page.goto("/shop?category=lehenga");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "04-category-lehengas.png"), fullPage: true });
  });

  test("Capture Product Detail Page", async ({ page }) => {
    await page.goto("/shop/1"); // Royal Blue Banarasi Silk Saree
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "05-product-detail.png"), fullPage: true });
  });
  
  test("Capture Cart Slider/Drawer", async ({ page }) => {
    await page.goto("/shop/1");
    await page.waitForTimeout(1000);
    
    // Select Size
    const sizeBtn = page.locator("button").filter({ hasText: /^(S|M|L)$/ }).first();
    if (await sizeBtn.count() > 0) {
      await sizeBtn.click();
    }
    
    // Select Event Date
    const chooseDateBtn = page.getByRole('button', { name: /Select Event Date/i });
    if (await chooseDateBtn.count() > 0) {
        await chooseDateBtn.click();
        await page.waitForTimeout(500);
        
        // click next month to ensure we find available dates
        const nextMonthBtn = page.locator('button[name="next-month"]');
        if (await nextMonthBtn.count() > 0) await nextMonthBtn.click();
        
        const dateBtn = page.locator('.rdp-day:not(.rdp-day_disabled)').first();
        if (await dateBtn.count() > 0) {
            await dateBtn.click();
            await page.getByRole('button', { name: /Confirm Date/i }).click();
        }
    }
    
    // Add to cart
    const rentBtn = page.locator("button").filter({ hasText: /Rent Now/i }).first();
    if (await rentBtn.count() > 0) {
        await rentBtn.click();
        await page.waitForTimeout(1000); // Wait for cart drawer to slide in
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, "06-cart-drawer.png") });
    }
  });

  test("Capture Checkout Page", async ({ page }) => {
    await page.goto("/checkout");
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "07-checkout.png"), fullPage: true });
  });

  test("Capture About Page", async ({ page }) => {
    await page.goto("/about");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "08-about.png"), fullPage: true });
  });

  test("Capture FAQ Page", async ({ page }) => {
    await page.goto("/faq");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "09-faq.png"), fullPage: true });
  });

  test("Capture Contact Page", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "10-contact.png"), fullPage: true });
  });
});
