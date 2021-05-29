import puppeteer from "puppeteer";
import { CodalInstance, CodalObject } from "./codal";
class Puppeteer {
  private static instance: Puppeteer;
  public codal!: CodalObject;
  private browser: puppeteer.Browser;
  private constructor(browser: puppeteer.Browser) {
    this.browser = browser;
  }
  public static async getInstance(): Promise<Puppeteer> {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
      timeout: 10000,
    });

    if (!Puppeteer.instance) {
      Puppeteer.instance = new Puppeteer(browser);
    }
    return Puppeteer.instance;
  }
  private generateURL(): string {
    return "http://codal.ir" + this.codal.Url + "&sheetId=1";
  }
  async read(c: CodalObject) {
    this.codal = c;
    console.log(12);
    const page = await this.browser.newPage();
    await page.goto(this.generateURL());
    const data = await page.evaluate(() => {
      const tds = Array.from(document.querySelectorAll("table > tbody tr"));
      // @ts-ignore
      return tds
        .map((td: any) => String(td.innerText))
        .map((e: string) => {
          let re = e.split("\t");
          re = re.filter((e) => e != "");
          return re;
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
