const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

(async () => {
  const screenshotDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--window-size=1920,1080'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });

  console.log('1. Capturing Auth Page...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2500)); // Allow 3D Torus knot animation to render
  await page.screenshot({ path: path.join(screenshotDir, 'auth_page.png'), fullPage: false });
  console.log('✓ Saved auth_page.png');

  console.log('2. Authenticating via Demo...');
  // Click 1-click demo button or fill credentials
  const demoButtons = await page.$$('button');
  let clicked = false;
  for (const btn of demoButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text.includes('1-Click Demo') || text.includes('1-Click Instant Demo Login') || text.includes('Demo')) {
      await btn.click();
      clicked = true;
      break;
    }
  }

  if (!clicked) {
    const emailInput = await page.$('input[type="email"]');
    if (emailInput) {
      await page.type('input[type="email"]', 'demo@salesgenie.ai');
      await page.type('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
    }
  }

  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 6000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 2000));

  // Set Dark Mode first
  await page.evaluate(() => {
    localStorage.setItem('tailadmin-theme', 'dark');
    document.documentElement.classList.add('dark');
  });
  await new Promise(r => setTimeout(r, 500));

  // Dark Theme Captures
  const darkPages = [
    { url: 'http://localhost:5173/dashboard', filename: 'dashboard_overview.png', wait: 2500 },
    { url: 'http://localhost:5173/leads', filename: 'lead_intelligence.png', wait: 2500 },
    { url: 'http://localhost:5173/pipeline', filename: 'deal_pipeline.png', wait: 2500 },
    { url: 'http://localhost:5173/outreach', filename: 'ai_outreach.png', wait: 2500 },
    { url: 'http://localhost:5173/meetings', filename: 'meeting_intelligence.png', wait: 2500 },
    { url: 'http://localhost:5173/settings', filename: 'settings_view.png', wait: 2000 },
  ];

  for (const p of darkPages) {
    console.log(`Capturing Dark Mode: ${p.filename}...`);
    await page.goto(p.url, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, p.wait));
    await page.screenshot({ path: path.join(screenshotDir, p.filename), fullPage: false });
    console.log(`✓ Saved ${p.filename}`);
  }

  // Light Theme Captures
  await page.evaluate(() => {
    localStorage.setItem('tailadmin-theme', 'light');
    document.documentElement.classList.remove('dark');
  });
  await new Promise(r => setTimeout(r, 500));

  const lightPages = [
    { url: 'http://localhost:5173/dashboard', filename: 'dashboard_light.png', wait: 2000 },
    { url: 'http://localhost:5173/leads', filename: 'leads_light.png', wait: 2000 },
    { url: 'http://localhost:5173/pipeline', filename: 'pipeline_light.png', wait: 2000 },
  ];

  for (const p of lightPages) {
    console.log(`Capturing Light Mode: ${p.filename}...`);
    await page.goto(p.url, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, p.wait));
    await page.screenshot({ path: path.join(screenshotDir, p.filename), fullPage: false });
    console.log(`✓ Saved ${p.filename}`);
  }

  await browser.close();
  console.log('🎉 All high-resolution screenshots captured successfully!');
})();
