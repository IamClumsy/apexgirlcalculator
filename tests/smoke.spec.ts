import { test, expect } from '@playwright/test';

test('smoke: load app and compute breakdown', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.locator('text=ApexGirl Resource Calculator')).toBeVisible();

  // Ensure sidebar controls are present
  await page.waitForSelector('label:has-text("Start")', { timeout: 10000 });
  const startElem = page.locator('label:has-text("Start")').locator('xpath=following-sibling::*[1]');
  const endElem = page.locator('label:has-text("End")').locator('xpath=following-sibling::*[1]');
  await expect(startElem).toBeVisible({ timeout: 5000 });
  await expect(endElem).toBeVisible({ timeout: 5000 });

  // if select -> choose first two options; otherwise fill inputs
  const startTag = await startElem.evaluate((el) => el.nodeName);
  if (startTag === 'SELECT') {
    const startSelect = startElem;
    const opts = await startSelect.locator('option').allTextContents();
    if (opts.length >= 2) {
      await startSelect.selectOption({ label: opts[0] });
      await endElem.selectOption({ label: opts[1] });
    } else if (opts.length === 1) {
      await startSelect.selectOption({ label: opts[0] });
      await endElem.selectOption({ label: opts[0] });
    }
  } else {
    await startElem.fill('1');
    await endElem.fill('2');
  }

  // Wait for breakdown to appear
  const breakdownTitle = page.locator('text=Breakdown');
  await expect(breakdownTitle).toBeVisible({ timeout: 5000 });

  // There should be at least one non-header row in the breakdown table
  const rows = page.locator('div.mt-4 table tbody tr');
  await expect(rows.first()).toBeVisible();

  // Optionally, capture a screenshot for verification
  await page.screenshot({ path: 'test-output/smoke-screenshot.png', fullPage: false });
});
