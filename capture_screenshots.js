const puppeteer = require('/tmp/puppeteer-test/node_modules/puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const screenshotDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });

  console.log('Navigating to login...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });

  // Check if 1-click instant demo button exists or fill inputs
  await page.waitForSelector('input[type="email"], button', { timeout: 5000 }).catch(() => {});
  
  // Try 1-click demo button or fill
  const demoBtn = await page.$('button');
  const demoButtons = await page.$$('button');
  let clicked = false;
  for (const btn of demoButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('1-Click Instant Demo Login') || text.includes('Demo Login') || text.includes('Sign In')) {
      await btn.click();
      clicked = true;
      break;
    }
  }

  if (!clicked) {
    await page.type('input[type="email"]', 'demo@salesgenie.ai');
    await page.type('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
  }

  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 5000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 2000));

  // Force Light Theme in localStorage and DOM
  await page.evaluate(() => {
    localStorage.setItem('tailadmin-theme', 'light');
    document.documentElement.classList.remove('dark');
  });
  await new Promise(r => setTimeout(r, 500));


  // List of pages to capture
  const pages = [
    { url: 'http://localhost:5173/dashboard', filename: 'dashboard_overview.png', wait: 2000 },
    { url: 'http://localhost:5173/leads', filename: 'lead_intelligence.png', wait: 2000 },
    { url: 'http://localhost:5173/pipeline', filename: 'deal_pipeline.png', wait: 2000 },
    { url: 'http://localhost:5173/outreach', filename: 'ai_outreach.png', wait: 2000 },
    { url: 'http://localhost:5173/meetings', filename: 'meeting_intelligence.png', wait: 2000 },
  ];

  for (const p of pages) {
    console.log(`Capturing ${p.filename}...`);
    await page.goto(p.url, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, p.wait));
    await page.screenshot({ path: path.join(screenshotDir, p.filename), fullPage: false });
    console.log(`✓ Saved ${p.filename}`);
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
})();
