import puppeteer from 'puppeteer';
const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
page.on('console', msg => console.log('PAGE LOG:', msg.text()));
page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
try {
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
} catch (e) {
  console.log('GOTO ERROR:', e.message);
}
try {
  await page.goto('http://localhost:5173/#/admin', { waitUntil: 'networkidle0' });
} catch (e) {
  console.log('GOTO ADMIN ERROR:', e.message);
}
await browser.close();
