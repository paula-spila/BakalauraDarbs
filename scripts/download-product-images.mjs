import fs from "node:fs";
import https from "node:https";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../public/images/products");

const unsplashByProductId = {
  1: "photo-1666445844615-0a3930270f13",
  2: "photo-1559839914-17aae19cec71",
  3: "photo-1666013942797-9daa4b8b3b4f",
  4: "photo-1584948447649-f0b6e8d19f68",
  5: "photo-1530006498959-b7884e829a04",
  6: "photo-1738520420640-5818ce094b4e",
  7: "photo-1580428456190-7348f304b927",
  8: "photo-1612293905607-b003de9e54fb",
  9: "photo-1638780506095-3d61a4f0edd6",
  10: "photo-1674591409662-55f4f2c55fff",
  11: "photo-1650394923482-a0d03ffb2512",
  12: "photo-1616663717839-2fea42e1a1f6",
  13: "photo-1616622236995-cb00e537365e",
  14: "photo-1584305574647-0cc949a2bb9f",
  15: "photo-1634082980789-f93655ed39d2",
  16: "photo-1531346878377-a5be20888e57",
  17: "photo-1583485088034-697b5bc54ccd",
  18: "photo-1578237493287-8d4d2b03591a",
  19: "photo-1562914657-1cfb9811f0f6",
  20: "photo-1607006555271-0939bf0333eb",
  21: "photo-1743187360373-513ac4a7266f",
  22: "photo-1652209751591-598953b003d7",
  23: "photo-1675264123540-e74419f2ac73",
  24: "photo-1607356934780-0d2f33dea029",
  25: "photo-1596002936233-d494e7fe456a",
  26: "photo-1648203174420-aa0cc956ae45",
  27: "photo-1519583916722-289d542b19a7",
  28: "photo-1601049541289-9b1b7bbbfe19",
  29: "photo-1559818469-fdf7a1ae929c",
  30: "photo-1687526360728-f1af24aac201",
  31: "photo-1694680319722-02b0f4ebd5cf",
  32: "photo-1652218484720-cd53e15ce7a6",
  33: "photo-1563861826100-9cb868fdbe1c",
  34: "photo-1587386252165-2904e4a13fd9",
  35: "photo-1694255565757-516cfbf5020d",
  36: "photo-1719251294346-fb8babf6b283",
  37: "photo-1584628804572-f84284d9f388",
  38: "photo-1587145820137-a9dbc8c5ed99",
  39: "photo-1591375607635-2d8fd2a613ce",
  40: "photo-1631098983935-5363b8e50edb",
  41: "photo-1581793111741-04b7034d1cb2",
  42: "photo-1736888138545-c5a7736e35c0",
  43: "photo-1758979645721-ad65bacd6708",
  44: "photo-1773609688536-404b12d4a1c7",
  45: "photo-1724968488062-1741d6a12155",
  46: "photo-1550623685-2227f7bbef18",
  47: "photo-1700709678003-01941f72fb92",
  48: "photo-1695132125432-e1ca35910f12",
  49: "photo-1626897844957-ee047befddc3",
  50: "photo-1728034261564-18930dcb2c8e",
  51: "photo-1640034031367-29ebb68fbb9c",
  52: "photo-1653103725296-bff7e65afe10",
  53: "photo-1727510153682-bd4570ad05ce",
  54: "photo-1550963295-019d8a8a61c5",
  55: "photo-1542556399-bc50d87551f9",
  56: "photo-1590019012497-b44f1aaa40d3",
  57: "photo-1562240020-ce31ccb0fa7d",
  58: "photo-1760624294514-3548bee70d26",
  59: "photo-1551818014-7c8ace9c1b5c",
  60: "photo-1621177555452-bedbe4c28879",
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          file.close();
          fs.unlinkSync(dest);
          return download(res.headers.location, dest)
            .then(resolve)
            .catch(reject);
        }
        if (res.statusCode !== 200) {
          file.close();
          fs.unlinkSync(dest);
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        res.pipe(file);

        file.on("finish", () => {
          file.close(() => resolve());
        });
      })
      .on("error", (err) => {
        file.close();

        fs.unlink(dest, () => reject(err));
      });
  });
}
fs.mkdirSync(outDir, { recursive: true });

for (const [productId, imageId] of Object.entries(unsplashByProductId)) {
  const url = `https://images.unsplash.com/${imageId}?w=900&h=900&fit=crop&q=80`;
  const dest = path.join(outDir, `${productId}.jpg`);
  process.stdout.write(`#${productId} (${imageId}) ... `);
  try {
    await download(url, dest);
    const size = fs.statSync(dest).size;
    console.log(`ok (${size} bytes)`);
  } catch (e) {
    console.log(`FAIL: ${e.message}`);
    process.exitCode = 1;
  }
}
