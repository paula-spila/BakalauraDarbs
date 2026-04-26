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

/** Pexels photo IDs loosely matched to catalog items */
const pexelsByProductId = {
  1: "312418", // mug / coffee cup
  2: "1000084", // water bottle
  3: "4068530", // wooden cutting board
  4: "4381392", // cutlery
  5: "674574", // bowl / dish
  6: "4230909", // kitchen towel
  7: "5691475", // linen / napkin fabric
  8: "4207785", // candle
  9: "4246129", // storage / box
  10: "6044267", // woven basket
  11: "6480706", // desk / organizer
  12: "4380300", // bath towel
  13: "4202326", // liquid soap / dispenser
  14: "6620946", // bar soap
  15: "4465124", // toothbrush
  16: "4348401", // notebook
  17: "9986077", // pens stationery
  18: "1152077", // tote / fabric bag
  19: "8867245", // cork / coasters
  20: "6621381", // bathroom ceramic dish
  21: "1000084",
  22: "4068530",
  23: "4381392",
  24: "674574",
  25: "4230909",
  26: "5691475",
  27: "4207785",
  28: "4246129",
  29: "6044267",
  30: "6480706",
  31: "4380300",
  32: "4202326",
  33: "6620946",
  34: "4465124",
  35: "4348401",
  36: "9986077",
  37: "1152077",
  38: "8867245",
  39: "6621381",
  40: "312418",
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
