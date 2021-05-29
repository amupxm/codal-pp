import puppeteer from "puppeteer";
import { CodalInstance, CodalObject } from "./codal";
class Puppeteer {
  private static instance: Puppeteer;
  private codal: CodalObject;
  private browser: puppeteer.Browser;
  private constructor(c: CodalObject, browser: puppeteer.Browser) {
    this.codal = c;
    this.browser = browser;
  }
  public static async getInstance(c: CodalObject): Promise<Puppeteer> {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
      timeout: 10000,
    });

    if (!Puppeteer.instance) {
      Puppeteer.instance = new Puppeteer(c, browser);
    }
    return Puppeteer.instance;
  }
  private generateURL(): string {
    return "http://codal.ir/" + this.codal.Url + "&sheetId=1";
  }
  async read() {
    console.log(12);
    const page = await this.browser.newPage();
    await page.goto(this.generateURL());
    const data = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll("table > tbody tr"));
      // @ts-ignore
      return tds
        .map((td: any) => String(td.innerText))
        .map((e: string) => {
          return e.split("\n\t");
        });
    });
    await page.close();
    return data;
  }
  //   async readStats(c) {
  //     const s = "&sheetId=1";
  //     const url = "http://codal.ir/" + c.Url + s;
  //     const browser = await puppeteer.launch();
  //     const page = await browser.newPage();
  //     await page.goto(url);
  //     await page.screenshot({ path: "example.png" });

  //     await browser.close();
  //   }
}
export default Puppeteer;
