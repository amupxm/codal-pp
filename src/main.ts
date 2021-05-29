import Codal from "./model/codal";
import Puppeteer from "./model/Puppeteer";

import express, { Router } from "express";
import e from "express";
const router = express();

router.get("/:code", async (req, res) => {
  const symbolFa = req.params.code;
  const codalInstance = await new Codal(symbolFa).fetchData();
  const f = codalInstance.Letters.filter((e) => e.LetterCode == "ن-۱۰");
  if (f.length == 0) {
    return res.json({
      ok: false,
    });
  }
  const puppeteerInstance = await (await Puppeteer.getInstance(f[0])).read();
  res.json({
    codal: f[0],
    results: puppeteerInstance,
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
