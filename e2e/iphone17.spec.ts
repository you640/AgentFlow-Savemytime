import { test, expect } from '@playwright/test';
import { SCREENS } from './screens';

// ŠPECIÁLNE testy pre iPhone 17 — mobilné rozloženie naprieč všetkými obrazovkami.
// Bežia len v projekte "iphone-17".
test.describe('iPhone 17 — mobilné rozloženie', () => {
  for (const screen of SCREENS) {
    test(`${screen.label} — mobilná navigácia, skrytý sidebar, bez preteku`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'iphone-17', 'Len iPhone 17');

      await page.goto(screen.path);
      await expect(page.locator('h1').first()).toContainText(screen.label);
      await page.waitForTimeout(500);

      // Desktopový bočný panel (Shell) je na mobile skrytý
      await expect(page.locator('aside.md\\:flex')).toBeHidden();

      // Mobilná spodná navigácia je viditeľná a preklikateľná
      const bottomNav = page.locator('nav.md\\:hidden');
      await expect(bottomNav).toBeVisible();
      await expect(bottomNav.getByRole('link').first()).toBeVisible();

      // Bez horizontálneho preteku na 402px šírke
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow, `Preteok na iPhone 17 – ${screen.path}`).toBeLessThanOrEqual(1);
    });
  }

  test('Spodná navigácia prepne obrazovku', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'iphone-17', 'Len iPhone 17');

    await page.goto('/');
    const bottomNav = page.locator('nav.md\\:hidden');
    await bottomNav.getByRole('link', { name: 'Autopilot' }).click();
    await expect(page).toHaveURL(/\/autopilot$/);
    await expect(page.locator('h1').first()).toContainText('Autopilot');
  });

  test('Tap-targety spodnej nav ≥ 44×44 px (Apple HIG)', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'iphone-17', 'Len iPhone 17');

    await page.goto('/');
    const links = page.locator('nav.md\\:hidden a');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const box = await links.nth(i).boundingBox();
      expect(box, `bounding box for nav link ${i}`).not.toBeNull();
      expect(box!.width, `width of nav link ${i}`).toBeGreaterThanOrEqual(44);
      expect(box!.height, `height of nav link ${i}`).toBeGreaterThanOrEqual(44);
    }
  });

  test('index.html má viewport-fit=cover pre safe-area', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'iphone-17', 'Len iPhone 17');

    await page.goto('/');
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport, 'viewport meta content').toContain('viewport-fit=cover');
  });
});
