//npm install puppeteer
//node naverCapture.js

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// 👇 여기에 네이버 ID/PW를 직접 입력하세요
const NAVER_ID = 'kr007777';
const NAVER_PW = 'QWERasdf12@';

(async () => {
  const browser = await puppeteer.launch({
    headless: true, // 디버깅 원하면 false
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  try {
    // 1. 로그인 페이지 이동
    await page.goto('https://nid.naver.com/nidlogin.login', { waitUntil: 'networkidle2' });

    // 2. ID/PW 입력
    await page.type('#id', NAVER_ID, { delay: 100 });
    await page.type('#pw', NAVER_PW, { delay: 100 });

    // 3. 로그인 버튼 클릭 후 대기
    await Promise.all([
      page.click('.btn_login'),
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
    ]);

    // 4. CAPTCHA 또는 보안 인증 확인
    const url = page.url();
    if (url.includes('captcha') || url.includes('auth2fa')) {
      throw new Error('🛑 CAPTCHA 또는 2차 인증에 걸림 (자동화 차단)');
    }

    // 5. 로그인 성공 후 메인 페이지 이동
    await page.goto('https://www.naver.com', { waitUntil: 'networkidle2' });

    // 6. 캡처
    const savePath = path.join(__dirname, 'naver_screenshot.png');
    await page.screenshot({ path: savePath, fullPage: true });

    console.log(`✅ 캡처 성공: ${savePath}`);
  } catch (err) {
    console.error(`❌ 오류 발생: ${err.message}`);
  } finally {
    await browser.close();
  }
})();
