/**
 * Downloads product photos into public/images/products/{id}.jpg for local hosting.
 * Photos are from Pexels (https://www.pexels.com/license/) — free to use; attribution
 * appreciated. Run: node scripts/download-product-images.mjs
 */
import fs from "node:fs";
import https from "node:https";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../public/images/products");
const query = "auto=compress&cs=tinysrgb&w=900&h=900&fit=crop";

/**
 * One unique Pexels photo ID per catalog product (LV names → English stock search).
 * URLs verified via HTTP HEAD; re-run after changing IDs: npm run fetch-images
 */
const pexelsByProductId = {
  1: "6542390", // ceramic / pottery tableware (clay mug)
  2: "1000084", // water bottle
  3: "3943205", // wooden chopping board
  4: "4381392", // cutlery / flatware
  5: "674574", // ceramic bowl
  6: "4230909", // kitchen towel
  7: "5691475", // linen / fabric napkins
  8: "4207785", // candle
  9: "4246129", // storage box
  10: "6044267", // woven basket
  11: "6480706", // desk organizer tray
  12: "4380300", // bath towel stack
  13: "4202326", // liquid soap dispenser
  14: "6620946", // bar soap
  15: "4465124", // toothbrush
  16: "4348401", // notebook
  17: "9986077", // pens / stationery
  18: "1152077", // fabric tote bag
  19: "8867245", // cork coasters
  20: "6621381", // ceramic soap dish
  21: "157101", // glass pitcher / carafe
  22: "4871148", // garlic + spoons (closest free match to garlic press)
  23: "10388448", // spatula / flipping (kitchen utensil)
  24: "1646314", // dinner plate / dishware
  25: "3648307", // oven mitt / kitchen glove
  26: "4202821", // shower gel / body wash bottle
  27: "6621414", // cotton swabs / hygiene
  28: "3737599", // hand cream / cosmetic tube
  29: "5256141", // dental / bathroom small items
  30: "6620827", // bath mat / bathroom textile
  31: "97260", // potted plant / ceramic pot
  32: "3784391", // books / shelf (bookends mood)
  33: "7033891", // wall clock macro
  34: "6311662", // wall hooks / hardware
  35: "958545", // glass vase
  36: "3654592", // markers / colorful pens
  37: "4398180", // office supplies / folder mood
  38: "4259140", // flat lay stationery (planner stickers mood)
  39: "904616", // small pouch / cosmetic bag
  40: "265087", // desk / mouse pad surface mood
  41: "12974474", // stainless kettle on stove
  42: "4946444", // wooden spoons
  43: "7125621", // hand grinder (spice / pepper mill mood)
  44: "3992870", // silicone ice tray / kitchen mold
  45: "769289", // insulated travel mug / thermos mood
  46: "4259706", // bath salts / jar cosmetics
  47: "7440053", // shampoo bottles
  48: "2853432", // round mirror
  49: "6620861", // body brush / bath accessory wood
  50: "2977513", // folded face towels / cotton textiles
  51: "2887774", // LED / electric candle mood
  52: "6317199", // laundry basket / fabric bin
  53: "7647285", // vacuum / cleaning appliance mood
  54: "4239113", // window cleaning / squeegee mood
  55: "5691700", // small hardware / felt pads mood
  56: "6190903", // ruler / metal straight edge mood
  57: "7845307", // office documents (shredder proxy — no dedicated shredder on Pexels)
  58: "5990042", // bag strap / accessories
  59: "5951759", // USB flash drive at laptop
  60: "923311", // desk lamp on
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          file.close();
          fs.unlinkSync(dest);
          return download(res.headers.location, dest).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          file.close();
          fs.unlinkSync(dest);
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        res.pipe(file);
        file.on("finish", () => file.close(() => resolve()));
      })
      .on("error", (err) => {
        file.close();
        fs.unlink(dest, () => reject(err));
      });
  });
}

fs.mkdirSync(outDir, { recursive: true });

for (const [productId, pid] of Object.entries(pexelsByProductId)) {
  const url = `https://images.pexels.com/photos/${pid}/pexels-photo-${pid}.jpeg?${query}`;
  const dest = path.join(outDir, `${productId}.jpg`);
  process.stdout.write(`#${productId} (${pid}) … `);
  try {
    await download(url, dest);
    const size = fs.statSync(dest).size;
    console.log(`ok (${size} bytes)`);
  } catch (e) {
    console.log(`FAIL: ${e.message}`);
    process.exitCode = 1;
  }
}
