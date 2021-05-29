import Codal from "./model/codal";
import Puppeteer from "./model/Puppeteer";

import express, { Router } from "express";
import e from "express";
const router = express();
let PI: Puppeteer | null;

router.get("/:code", async (req, res) => {
  if (!PI) {
    PI = await Puppeteer.getInstance();
  }
  const symbolFa = req.params.code;
  const codalInstance = await new Codal(symbolFa).fetchData();
  const f = codalInstance.Letters.filter((e) => e.LetterCode == "ن-۱۰");
  if (f.length == 0) {
    return res.json({
      ok: false,
    });
  }
  const r = await PI.read(f[0]);
  let ccc = r.filter((ee) => ee.length != 0);
  f[0].Url = "http://codal.ir" + f[0].Url + "&sheetId=1";
  return res.json({
    codal: f[0],
    results: ccc,
  });
});

router.listen(3000, () => {
  console.log("im alive");
});
// async function get_response() {
//
//
//   c.Letters.forEach((e) => {
//     if (e.LetterCode == "ن-۱۰") {
//       console.log(e.Title);
//       i.readStats(e);
//       //
//     }
//   });
// }

// get_response();
