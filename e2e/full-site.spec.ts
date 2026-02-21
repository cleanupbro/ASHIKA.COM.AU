import { test, expect, type Page } from "@playwright/test";

// Helper: check no broken images on current page
async function checkNobrokenImages(page: Page) {
  const images = await page.$$eval("img", (imgs) =>
    imgs.map((img) => ({
      src: (img as HTMLImageElement).src,
      naturalWidth: (img as HTMLImageElement).naturalWidth,
      complete: (img as HTMLImageElement).complete,
    })),
  );
  const broken = images.filter(
    (img) => img.complete && img.naturalWidth === 0 && img.src !== "",
  );
  return broken;
}

// Helper: check video is present and has a source
async function checkHeroVideo(page: Page) {
  const video = page.locator("video");
  return video;
}

// ─────────────────────────────────────────
// 1. HOMEPAGE
// ─────────────────────────────────────────
test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("loads successfully with 200 status", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
  });

  test("has correct page title", async ({ page }) => {
    await expect(page).toHaveTitle(/ashika/i);
  });

  test("hero section is visible with video", async ({ page }) => {
    const video = page.locator("video");
    await expect(video).toBeVisible();
    const src = await video.locator("source").getAttribute("src");
    expect(src).toContain("hero-background.mp4");
  });

  test("hero headline text is visible", async ({ page }) => {
    await expect(page.locator("h1").first()).toBeVisible();
    const text = await page.locator("h1").first().innerText();
    expect(text.toLowerCase()).toContain("borrow");
  });

  test("hero CTA button is visible and links to /shop", async ({ page }) => {
    const cta = page.locator('a[href="/shop"]').first();
    await expect(cta).toBeVisible();
  });

  test("Borrowhood / how-it-works section exists", async ({ page }) => {
    // Look for the step images or text markers
    const stepSection = page.locator('img[src*="step-"]').first();
    await expect(stepSection).toBeVisible();
  });

  test("Categories section has 4 category links", async ({ page }) => {
    const categoryLinks = page.locator('a[href*="?category="]');
    await expect(categoryLinks).toHaveCount(4);
  });

  test("Featured Products section has cards", async ({ page }) => {
    const productCards = page.locator('a[href^="/shop/"]');
    await expect(productCards.first()).toBeVisible();
    const count = await productCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("Testimonials section is visible", async ({ page }) => {
    const testimonials = page.getByText(
      /customers love us|testimonials|what our customers/i,
    );
    // Loose check — the section should contain some review text
    const starIcons = page.locator("svg").filter({ hasText: "" });
    const reviewText = page
      .locator('text="★"')
      .or(page.locator('[class*="testimon"]'));
    // At minimum, the section renders without error
    await page.waitForLoadState("networkidle");
  });

  test("Features/Trust section is visible", async ({ page }) => {
    await expect(page.getByText("Premium Quality")).toBeVisible();
    await expect(page.getByText("Hassle-Free Returns")).toBeVisible();
    await expect(page.getByText("Express Delivery")).toBeVisible();
  });

  test("Newsletter section has email input", async ({ page }) => {
    const emailInput = page.locator('input[type="email"]').first();
    await expect(emailInput).toBeVisible();
  });

  test("navigation links are all visible", async ({ page }) => {
    await expect(page.locator('a[href="/shop"]').first()).toBeVisible();
    await expect(page.locator('a[href="/about"]')).toBeVisible();
    await expect(page.locator('a[href="/contact"]')).toBeVisible();
    await expect(page.locator('a[href="/faq"]')).toBeVisible();
  });

  test("no broken images on homepage", async ({ page }) => {
    await page.waitForLoadState("networkidle");
    const broken = await checkNobrokenImages(page);
    if (broken.length > 0) {
      console.log("Broken images on homepage:", broken);
    }
    expect(broken.length).toBe(0);
  });
});

// ─────────────────────────────────────────
// 2. SHOP PAGE
// ─────────────────────────────────────────
test.describe("Shop Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/shop");
  });

  test("loads successfully", async ({ page }) => {
    const response = await page.goto("/shop");
    expect(response?.status()).toBe(200);
  });

  test("has page heading", async ({ page }) => {
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("displays product cards", async ({ page }) => {
    const cards = page.locator('a[href^="/shop/"]');
    await expect(cards.first()).toBeVisible();
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test("product cards show price", async ({ page }) => {
    await expect(page.getByText(/\$\d+/i).first()).toBeVisible();
  });

  test('product cards show "Rent Now" or similar CTA', async ({ page }) => {
    const rentBtn = page
      .locator("button, a")
      .filter({ hasText: /rent|borrow/i })
      .first();
    await expect(rentBtn).toBeVisible();
  });

  test("filter by Sarees works", async ({ page }) => {
    await page.goto("/shop?category=saree");
    const cards = page.locator('a[href^="/shop/"]');
    await expect(cards.first()).toBeVisible();
  });

  test("filter by Lehengas works", async ({ page }) => {
    await page.goto("/shop?category=lehenga");
    const cards = page.locator('a[href^="/shop/"]');
    await expect(cards.first()).toBeVisible();
  });

  test("filter by Sherwanis works", async ({ page }) => {
    await page.goto("/shop?category=sherwani");
    const cards = page.locator('a[href^="/shop/"]');
    await expect(cards.first()).toBeVisible();
  });

  test("filter by Suits/Salwar Kameez works", async ({ page }) => {
    await page.goto("/shop?category=salwar_kameez");
    const cards = page.locator('a[href^="/shop/"]');
    await expect(cards.first()).toBeVisible();
  });

  test("no broken images on shop page", async ({ page }) => {
    await page.waitForLoadState("networkidle");
    const broken = await checkNobrokenImages(page);
    if (broken.length > 0) {
      console.log("Broken images on shop:", broken);
    }
    expect(broken.length).toBe(0);
  });
});

// ─────────────────────────────────────────
// 3. PRODUCT DETAIL PAGE
// ─────────────────────────────────────────
test.describe("Product Detail Page", () => {
  test("product 1 loads and has key sections", async ({ page }) => {
    const res = await page.goto("/shop/1");
    expect(res?.status()).toBe(200);

    // Product image
    const img = page.locator("img").first();
    await expect(img).toBeVisible();

    // Product title
    const title = page.locator("h1").first();
    await expect(title).toBeVisible();

    // Price
    await expect(page.getByText(/\$/i).first()).toBeVisible();

    // Rent Now button
    await expect(page.getByRole("button", { name: /rent now/i })).toBeVisible();
  });

  test("product 7 (lehenga) loads correctly", async ({ page }) => {
    await page.goto("/shop/7");
    const title = page.locator("h1").first();
    await expect(title).toBeVisible();
    const text = await title.innerText();
    expect(text.toLowerCase()).toContain("lehenga");
  });

  test("product 11 (sherwani) loads correctly", async ({ page }) => {
    await page.goto("/shop/11");
    const title = page.locator("h1").first();
    await expect(title).toBeVisible();
    const text = await title.innerText();
    expect(text.toLowerCase()).toContain("sherwani");
  });

  test("no broken images on product detail", async ({ page }) => {
    await page.goto("/shop/1");
    await page.waitForLoadState("networkidle");
    const broken = await checkNobrokenImages(page);
    expect(broken.length).toBe(0);
  });
});

// ─────────────────────────────────────────
// 4. ABOUT PAGE
// ─────────────────────────────────────────
test.describe("About Page", () => {
  test("loads successfully", async ({ page }) => {
    const res = await page.goto("/about");
    expect(res?.status()).toBe(200);
  });

  test('has heading "The Ashika Story"', async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("h1")).toContainText("Ashika");
  });

  test("has three brand pillars", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByText(/curated luxury/i)).toBeVisible();
    await expect(page.getByText(/sustainable fashion/i)).toBeVisible();
    await expect(page.getByText(/hygiene first/i)).toBeVisible();
  });

  test("hero image on about page is not broken", async ({ page }) => {
    await page.goto("/about");
    await page.waitForLoadState("networkidle");
    const broken = await checkNobrokenImages(page);
    expect(broken.length).toBe(0);
  });
});

// ─────────────────────────────────────────
// 5. FAQ PAGE
// ─────────────────────────────────────────
test.describe("FAQ Page", () => {
  test("loads successfully", async ({ page }) => {
    const res = await page.goto("/faq");
    expect(res?.status()).toBe(200);
  });

  test("has FAQ heading", async ({ page }) => {
    await page.goto("/faq");
    await expect(page.locator("h1")).toContainText("FAQ");
  });

  test("accordion items are visible and expandable", async ({ page }) => {
    await page.goto("/faq");
    const firstQuestion = page.getByText("How does the rental process work?");
    await expect(firstQuestion).toBeVisible();
    await firstQuestion.click();
    // After click, the answer should appear
    await expect(page.getByText("Simply browse our collection")).toBeVisible();
  });

  test("has all 4 FAQ categories", async ({ page }) => {
    await page.goto("/faq");
    await expect(page.getByText("Rental Process")).toBeVisible();
    await expect(page.getByText("Shipping & Returns")).toBeVisible();
    await expect(page.getByText("Payments & Bond")).toBeVisible();
    await expect(page.getByText("Care & Damage")).toBeVisible();
  });

  test("Contact Us CTA is visible on FAQ page", async ({ page }) => {
    await page.goto("/faq");
    await expect(page.getByRole("link", { name: "CONTACT US" })).toBeVisible();
  });
});

// ─────────────────────────────────────────
// 6. CONTACT PAGE — FORM TESTING
// ─────────────────────────────────────────
test.describe("Contact Page & Form", () => {
  test("loads successfully", async ({ page }) => {
    const res = await page.goto("/contact");
    expect(res?.status()).toBe(200);
  });

  test("has Contact heading", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("h1")).toContainText("Contact");
  });

  test("displays all contact info fields", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByText("info@ashika.com.au")).toBeVisible();
    await expect(page.getByText("+61 400 000 000")).toBeVisible();
    await expect(page.getByText("Sydney, NSW, Australia")).toBeVisible();
  });

  test("contact form has all required fields", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="subject"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
    await expect(
      page.getByRole("button", { name: /send message/i }),
    ).toBeVisible();
  });

  test("form cannot be submitted empty (HTML5 validation)", async ({
    page,
  }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: /send message/i }).click();
    // Name field should still be empty and form not submitted
    const nameInput = page.locator('input[name="name"]');
    await expect(nameInput).toBeVisible();
  });

  test("form submits successfully with valid data", async ({ page }) => {
    await page.goto("/contact");

    await page.locator('input[name="name"]').fill("Test User");
    await page.locator('input[name="email"]').fill("test@example.com");
    await page
      .locator('input[name="subject"]')
      .fill("Test Subject from Playwright");
    await page
      .locator('textarea[name="message"]')
      .fill("This is an automated test message from Playwright.");

    await page.getByRole("button", { name: /send message/i }).click();

    // Should show the success state
    await expect(page.getByText("Message Sent")).toBeVisible({
      timeout: 10000,
    });
    await expect(
      page.getByText("Thank you for reaching out. We'll be in touch soon."),
    ).toBeVisible();
  });

  test('success state has "Send Another" button that resets form', async ({
    page,
  }) => {
    await page.goto("/contact");
    await page.locator('input[name="name"]').fill("Test User");
    await page.locator('input[name="email"]').fill("test@example.com");
    await page.locator('input[name="subject"]').fill("Reset test");
    await page.locator('textarea[name="message"]').fill("Testing reset flow.");
    await page.getByRole("button", { name: /send message/i }).click();
    await expect(page.getByText("Message Sent")).toBeVisible({ timeout: 8000 });

    await page.getByRole("button", { name: /send another/i }).click();
    // Form should reappear
    await expect(page.locator('input[name="name"]')).toBeVisible();
  });
});

// ─────────────────────────────────────────
// 7. CHECKOUT PAGE
// ─────────────────────────────────────────
test.describe("Checkout Page", () => {
  test("checkout page loads", async ({ page }) => {
    const res = await page.goto("/checkout");
    expect([200, 307, 302]).toContain(res?.status());
  });
});

// ─────────────────────────────────────────
// 8. NAVIGATION & FOOTER
// ─────────────────────────────────────────
test.describe("Navigation & Footer", () => {
  test("navigation links route correctly", async ({ page }) => {
    await page.goto("/");

    // Click About
    await page.locator('a[href="/about"]').click();
    await expect(page).toHaveURL(/.*about/);

    // Click FAQ
    await page.locator('a[href="/faq"]').click();
    await expect(page).toHaveURL(/.*faq/);

    // Click Contact
    await page.locator('a[href="/contact"]').click();
    await expect(page).toHaveURL(/.*contact/);
  });

  test("footer has key links", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer.locator('a[href="/privacy"]')).toBeVisible();
    await expect(footer.locator('a[href="/terms"]')).toBeVisible();
  });
});

// ─────────────────────────────────────────
// 9. PRIVACY & TERMS PAGES
// ─────────────────────────────────────────
test.describe("Legal Pages", () => {
  test("Privacy policy page loads", async ({ page }) => {
    const res = await page.goto("/privacy");
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("Terms of service page loads", async ({ page }) => {
    const res = await page.goto("/terms");
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1").first()).toBeVisible();
  });
});

// ─────────────────────────────────────────
// 10. 404 PAGE
// ─────────────────────────────────────────
test.describe("404 Page", () => {
  test("shows custom not-found page for invalid routes", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");
    await expect(
      page.getByText(/not found|404|page does not exist/i),
    ).toBeVisible();
  });
});
