import puppeteer from 'puppeteer';

async function main(subgraphDeploymentID) {
  const browser = await puppeteer.launch();

  console.log('Browser launched');

  const page = await browser.newPage();

  console.log('Page opened');

  const google = `https://www.google.com/search?q=${subgraphDeploymentID}`

  await page.goto(google);

  console.log('Page loaded: ', google)

  const subgraphLink = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('a'));
    return anchors.map(anchor => anchor.href).filter(href => href.includes('thegraph.com/explorer/subgraphs'))[0];
  })

  try {
    console.log("The Graph links found: ", subgraphLink)
  } catch {
    console.log("No links found")
    return null
  }

  await page.goto(subgraphLink);

  const title = await page.evaluate(() => document.getElementsByClassName('css-utgtfe')[0].getInnerHTML());

  if (title) {
    console.log('Title found: ', title);
  } else {
    console.log('Title not found');
  }
  await browser.close();
  return title;
}

const subgraphDeploymentIDs = [
  "QmaCRFCJX3f1LACgqZFecDphpxrqMyJw1r2DCBHXmQRYY8",
  "Qmaz1R8vcv9v3gUfksqiS9JUz7K9G8S5By3JYn8kTiiP5K",
  "Qmadj8x9km1YEyKmRnJ6EkC2zpJZFCfTyTZpuqC3j6e1QH"
]

subgraphDeploymentIDs.forEach(async (deploymentID) => {
  const title = await main(deploymentID);
}
);
