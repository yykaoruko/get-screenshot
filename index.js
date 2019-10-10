const puppeteer = require('puppeteer');

const watchList = ['https://diffeasy.com/']; // リンクリスト
const walkList = ['https://diffeasy.com/']; // 今から訪問するリンク
const result = [];

let browser;
let page;

async function init () {
  browser = await puppeteer.launch({headless: true});
  page = await browser.newPage();
  page.setViewport({width: 1200, height: 800});
};

async function run(url) {
  console.log(url);

  // ページ遷移
  await page.goto(url);

  // タイトル取得
  const title = await page.title();

  // スクリーンショット取得
  const screenshotPath = `screenshot/${title}.png`;
  await page.screenshot({path: screenshotPath});

  // リンク取得
  const links = await page.$$eval('a[href]', links => {
    return links.map(link => link.href);
  });

  // watchListになければwatchListとwalkListに追加
  links.forEach(link => {
    const isListed = watchList.includes(link);
    if(!isListed) {
      watchList.push(link);
      walkList.push(link);
    }
  })

  // 索引的なの追加
  const resultItem = {
    title: title,
    url: url,
    screenshot: screenshotPath
  }
  result.push(resultItem)

  // 削除
  const index = walkList.indexOf(url);
  walkList.splice(index, 1);
};

// 実行関数
async function main() {
  await init();
  await sub();
}

async function sub() {
  // TODO: かっこよく再帰する
  if (walkList.length > 0) {
    for (const url of walkList) {
      await run(url);
    }
    if (walkList.length > 0) {
      for (const url of walkList) {
        await run(url);
      }
    }
  }
}

main();