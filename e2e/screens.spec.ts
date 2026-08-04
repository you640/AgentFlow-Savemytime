import { test, expect } from '@playwright/test';
import { SCREENS } from './screens';

// Základný smoke + responzivita naprieč VŠETKÝMI obrazovkami.
// Beží v oboch projektoch (desktop-chromium aj iphone-17).
for (const screen of SCREENS) {
  test(`${screen.label} (${screen.path}) — načíta sa, bez JS chýb a bez horizontálneho preteku`, async ({
    page,
  }, testInfo) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));

    await page.goto(screen.path);

    // Hlavička Shellu s aktívnym labelom je vždy prítomná
    await expect(page.locator('h1').first()).toContainText(screen.label);

    // Nechaj dobehnúť vstupné animácie
    await page.waitForTimeout(700);

    // Artefakt: screenshot obrazovky pre daný projekt (vrátane iPhone 17)
    const shot = await page.screenshot({ fullPage: true });
    await testInfo.attach(`${testInfo.project.name}__${screen.label}`, {
      body: shot,
      contentType: 'image/png',
    });

    // Základná responzivita: žiadny horizontálny preteok
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow, `Horizontálny preteok na ${screen.path} (${testInfo.project.name})`).toBeLessThanOrEqual(1);

    // Žiadne nezachytené JS chyby
    expect(errors, `JS chyby na ${screen.path}`).toEqual([]);
  });
}
