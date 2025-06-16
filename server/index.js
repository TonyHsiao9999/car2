const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 自動化腳本
async function runAutomation() {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu'
    ],
    executablePath: process.env.CHROME_BIN || null
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    // 設定超時時間
    await page.setDefaultNavigationTimeout(30000);
    await page.setDefaultTimeout(30000);

    // 前往目標網站
    await page.goto('https://www.ntpc.ltc-car.org/');
    
    // 輸入身分證字號
    await page.waitForSelector('input#IDNumber');
    await page.type('input#IDNumber', process.env.ID_NUMBER || 'A102574899');
    
    // 輸入密碼
    await page.waitForSelector('input#password');
    await page.type('input#password', process.env.PASSWORD || 'visi319VISI');
    
    // 點擊確認按鈕
    await page.waitForSelector('a.button-fill:nth-child(2)');
    await page.click('a.button-fill:nth-child(2)');
    
    // 點擊登入成功確認
    await page.waitForSelector('span.dialog-button');
    await page.click('span.dialog-button');
    
    // 點擊預約連結
    await page.waitForSelector('a.link:nth-child(2)');
    await page.click('a.link:nth-child(2)');
    
    // 選擇上車地
    await page.waitForSelector('select#pickUp_location');
    await page.select('select#pickUp_location', '1');
    
    // 輸入上車地詳細地址
    await page.waitForSelector('input#pickUp_address_text');
    await page.type('input#pickUp_address_text', '亞東紀念醫院');
    
    // 點擊地址欄位
    await page.click('input#pickUp_address_text');
    await page.waitForTimeout(500);
    
    // 按下向下鍵
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(1000);
    
    // 點擊其他地方確認地址
    await page.click('.location:nth-child(1) > label');
    
    // 選擇下車地
    await page.waitForSelector('select#getOff_location');
    await page.select('select#getOff_location', '0');
    
    // 選擇下車地詳細地址
    await page.waitForSelector('select#getOff_address');
    await page.select('select#getOff_address', '新北市板橋區中正路1巷18號');
    
    // 選擇日期
    await page.waitForSelector('select#appointment_date');
    await page.select('select#appointment_date', '13');
    
    // 選擇時間
    await page.waitForSelector('select#appointment_hour');
    await page.select('select#appointment_hour', '16');
    
    // 選擇分鐘
    await page.waitForSelector('select#appointment_minutes');
    await page.select('select#appointment_minutes', '40');
    
    // 不同意30分鐘
    await page.waitForSelector('.form_item:nth-child(6) .cus_checkbox_type1:nth-child(2) > div');
    await page.click('.form_item:nth-child(6) .cus_checkbox_type1:nth-child(2) > div');
    
    // 選擇陪同人數
    await page.waitForSelector('.inner > #accompany_label');
    await page.select('.inner > #accompany_label', '1');
    
    // 選擇不共乘
    await page.waitForSelector('.form_item:nth-child(10) .cus_checkbox_type1:nth-child(2) > div');
    await page.click('.form_item:nth-child(10) .cus_checkbox_type1:nth-child(2) > div');
    
    // 選擇搭輪椅上車
    await page.waitForSelector('.form_item:nth-child(11) .cus_checkbox_type1:nth-child(1) > div');
    await page.click('.form_item:nth-child(11) .cus_checkbox_type1:nth-child(1) > div');
    
    // 選擇非大型輪椅
    await page.waitForSelector('.form_item:nth-child(12) .cus_checkbox_type1:nth-child(2) > div');
    await page.click('.form_item:nth-child(12) .cus_checkbox_type1:nth-child(2) > div');
    
    // 點擊確認預約資訊
    await page.waitForSelector('.page_bottom > .button');
    await page.click('.page_bottom > .button');
    
    // 點擊送出預約
    await page.waitForSelector('button.button-fill:nth-child(2)');
    await page.click('button.button-fill:nth-child(2)');
    
    await browser.close();
    return { success: true, message: '預約成功' };
  } catch (error) {
    console.error('自動化過程發生錯誤:', error);
    await browser.close();
    return { success: false, message: `預約失敗: ${error.message}` };
  }
}

// API 路由
app.post('/api/run-automation', async (req, res) => {
  try {
    const result = await runAutomation();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 