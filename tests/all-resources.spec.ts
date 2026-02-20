import { test, expect } from '@playwright/test';

test('verify breakdown for all resources', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  const resource = page.getByLabel('Resource').locator('select');
  const optionCount = await resource.locator('option').count();
  const optionTexts = [] as string[];
  for (let i = 0; i < optionCount; i++) optionTexts.push((await resource.locator('option').nth(i).textContent()) || '');

  for (const label of optionTexts) {
    console.log('Testing resource:', label);
    await resource.selectOption({ label });

    // wait for the datalist options to populate (or fallback)
    let startVal = '1';
    let endVal = '2';
    try {
      await page.waitForSelector('datalist#keyOptions option', { timeout: 3000 });
      const opts = page.locator('datalist#keyOptions option');
      const cnt = await opts.count();
      if (cnt >= 2) {
        startVal = (await opts.nth(0).getAttribute('value')) || startVal;
        endVal = (await opts.nth(Math.min(1, cnt - 1)).getAttribute('value')) || endVal;
      } else if (cnt === 1) {
        startVal = (await opts.nth(0).getAttribute('value')) || startVal;
        endVal = startVal;
      }
      } catch {
      // no datalist options available; fall back to defaults
    }

    // fill start/end selects
    const startSelect = page.locator('label:has-text("Start")').locator('xpath=following-sibling::*[1]');
    const endSelect = page.locator('label:has-text("End")').locator('xpath=following-sibling::*[1]');
    await expect(startSelect).toBeVisible();
    const opts = await startSelect.locator('option').allTextContents();
    if (opts.length > 0) {
      // prefer matching values from datalist if present
      if (opts.includes(String(startVal))) await startSelect.selectOption({ label: String(startVal) });
      else await startSelect.selectOption({ label: opts[0] });
      if (opts.includes(String(endVal))) await endSelect.selectOption({ label: String(endVal) });
      else await endSelect.selectOption({ label: opts[Math.min(1, opts.length - 1)] });
    }

    // wait for breakdown to appear
    const breakdownTitle = page.locator('text=Breakdown');
    await expect(breakdownTitle).toBeVisible({ timeout: 5000 });

    // ensure at least one material row is present (or at least result text)
    const rows = page.locator('div.mt-4 table tbody tr');
    if ((await rows.count()) === 0) {
      await expect(page.locator('text=Materials required')).toBeVisible({ timeout: 3000 });
    }

    // small pause so UI can settle between iterations
    await page.waitForTimeout(200);
  }
});
