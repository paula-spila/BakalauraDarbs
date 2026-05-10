import { getProductById, PRODUCTS, categoryLabel } from "../data/products.js";

export function parseProductIdFromPath(pathname) {
  if (!pathname || typeof pathname !== "string") return null;
  const m = pathname.match(/\/produkts\/(\d+)/);
  return m ? Number(m[1]) : null;
}

function categoryNameMatches(product, targetCategoryId, targetCategoryName) {
  if (!product) return false;
  if (targetCategoryId && product.categoryId === targetCategoryId) return true;
  if (targetCategoryName) {
    const label = categoryLabel(product.categoryId);
    const norm = (x) =>
      String(x)
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    return norm(label) === norm(targetCategoryName);
  }
  return false;
}

function lineForProduct(lines, productId) {
  const id = Number(productId);
  return (lines ?? []).find((l) => Number(l.productId) === id) ?? null;
}

function readCheckoutDom() {
  const pick = (...ids) => {
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el && "value" in el) return String(el.value ?? "").trim();
    }
    return "";
  };
  const fullname = pick("fullname", "fullname-rich");
  const email = pick("email", "email-rich");
  const phone = pick("phone", "phone-rich");
  const address = pick("address", "address-rich");
  const city = pick("city", "city-rich");
  const postal = pick("postal", "postal-rich");
  const termsMin = document.querySelector(
    ".checkout-fieldset--terms input[type=checkbox]",
  );
  const termsRich = document.querySelector(".rich-co-form input[type=checkbox]");
  const terms = Boolean(
    (termsMin && termsMin.checked) || (termsRich && termsRich.checked),
  );
  return { fullname, email, phone, address, city, postal, terms };
}

export function phoneInputPresentInCheckout() {
  return Boolean(document.getElementById("phone") || document.getElementById("phone-rich"));
}

/**
 * @returns {{ name: string, email: string, street: string, city: string, postalCode: string, phone: string }}
 */
export function getEnteredCheckoutSnapshot() {
  const d = readCheckoutDom();
  return {
    name: d.fullname,
    email: d.email,
    street: d.address,
    city: d.city,
    postalCode: d.postal,
    phone: d.phone ?? "",
  };
}

function digitsOnly(s) {
  return String(s ?? "").replace(/\D/g, "");
}

function postalDigitsMatch(enteredPostal, expectedPostal) {
  const ex = digitsOnly(expectedPostal);
  const got = digitsOnly(enteredPostal);
  if (!ex) return false;
  return got === ex || got.endsWith(ex) || got.includes(ex);
}

function phoneDigitsMatch(enteredPhone, expectedPhone) {
  const ex = digitsOnly(expectedPhone);
  const got = digitsOnly(enteredPhone);
  if (!ex) return true;
  return got === ex || got.endsWith(ex);
}

/**
 * @param {{ checkoutTestData?: object }} task
 * @param {ReturnType<typeof getEnteredCheckoutSnapshot>} snap
 */
export function checkoutEnteredMatchesExpected(task, snap) {
  const exp = task?.checkoutTestData;
  if (!exp || !snap) return false;
  if (norm(snap.email) !== norm(exp.email)) return false;
  if (!nameChunksMatch(snap.name, exp.name) && norm(snap.name) !== norm(exp.name)) {
    return false;
  }
  if (
    !addressMatchesLine(snap.street, exp.street) &&
    norm(snap.street) !== norm(exp.street)
  ) {
    return false;
  }
  if (norm(snap.city) !== norm(exp.city)) return false;
  if (!postalDigitsMatch(snap.postalCode, exp.postalCode)) return false;
  if (exp.phone != null && String(exp.phone).trim()) {
    if (!phoneDigitsMatch(snap.phone, exp.phone)) return false;
  }
  return true;
}

function basicEmailOk(email) {
  const e = String(email ?? "").trim();
  return e.includes("@") && e.length > 3 && !e.startsWith("@") && !e.endsWith("@");
}

function looksLikeValidAlternateCheckout(snap) {
  if (!snap.name || String(snap.name).trim().length < 2) return false;
  if (!basicEmailOk(snap.email)) return false;
  if (!snap.street || String(snap.street).trim().length < 3) return false;
  if (!snap.city || String(snap.city).trim().length < 2) return false;
  if (!/\d/.test(String(snap.postalCode ?? ""))) return false;
  if (phoneInputPresentInCheckout()) {
    const d = digitsOnly(snap.phone);
    if (d.length < 5) return false;
  }
  return true;
}

/**
 * Obligātie lauki + noteikumi; telefons obligāts, ja lauks ir DOM.
 * @param {{ checkoutTestData?: object }} task
 */
export function checkoutFormReadyForTask(task) {
  if (!task || task.successType !== "checkoutFormFilled") return false;
  const d = readCheckoutDom();
  if (!d.terms) return false;
  if (!basicEmailOk(d.email)) return false;
  if (!d.fullname || !d.address || !d.city || !d.postal) return false;
  if (phoneInputPresentInCheckout()) {
    if (digitsOnly(d.phone).length < 5) return false;
  }
  return true;
}

function norm(s) {
  return String(s ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function nameChunksMatch(fullname, expectedName) {
  const f = norm(fullname);
  const parts = norm(expectedName)
    .split(/\s+/)
    .filter((p) => p.length > 0);
  return parts.length > 0 && parts.every((p) => f.includes(p));
}

function addressMatchesLine(address, streetLine) {
  const a = norm(address);
  const tokens = norm(streetLine)
    .split(/\s+/)
    .filter((t) => t.length > 2);
  return tokens.some((t) => a.includes(t));
}

/**
 * Pabeidz, kad forma ir korekti aizpildīta: obligātie lauki + noteikumi;
 * dati atbilst testa profilam vai ir citi, bet derīgi (min. kvalitāte).
 * @param {{ successType?: string, checkoutTestData?: object }} task
 */
export function checkoutFormMatchesTask(task) {
  if (!task || task.successType !== "checkoutFormFilled") return false;
  if (!task.checkoutTestData) return false;
  if (!checkoutFormReadyForTask(task)) return false;
  const snap = getEnteredCheckoutSnapshot();
  if (checkoutEnteredMatchesExpected(task, snap)) return true;
  return looksLikeValidAlternateCheckout(snap);
}

/**
 * @param {object} args
 * @returns {boolean}
 */
export function evaluateAutoTaskSuccess(args) {
  const {
    task,
    pathname,
    hash,
    lines,
    cartPageOpen,
  } = args;
  if (!task?.successType) return false;
  const st = task.successType;
  const productId = parseProductIdFromPath(pathname);
  const product = productId != null ? getProductById(productId) : null;

  if (st === "productPage") {
    if (!product) return false;
    return Number(product.id) === Number(task.targetProductId);
  }

  if (st === "categoryProduct") {
    if (!product) return false;
    return categoryNameMatches(
      product,
      task.targetCategoryId,
      task.targetCategoryName,
    );
  }

  if (st === "priceConditionProduct") {
    if (!product) return false;
    const min = Number(task.minPrice);
    if (Number.isFinite(min)) {
      return product.price > min;
    }
    const max = Number(task.maxPrice);
    if (!Number.isFinite(max)) return false;
    return product.price < max;
  }

  if (st === "answerInput") {
    return false;
  }

  if (st === "cartContainsAndOpened") {
    if (!cartPageOpen) return false;
    const line = lineForProduct(lines, task.targetProductId);
    const minQ = Number(task.minQuantity ?? 1);
    if (!line) return false;
    return line.qty >= minQ;
  }

  if (st === "cartQuantity") {
    const line = lineForProduct(lines, task.targetProductId);
    if (!line) return false;
    return Number(line.qty) === Number(task.targetQuantity);
  }

  if (st === "infoSection") {
    const sec = String(task.targetSection ?? "").toLowerCase();
    const h = String(hash ?? "").toLowerCase();
    const path = pathname.toLowerCase();
    if (sec === "kontakti") {
      if (path.endsWith("/kontakti")) return true;
      if (path.includes("/informacija") && (h === "#kontakti" || h.includes("kontakti")))
        return true;
      return false;
    }
    if (sec === "piegade") {
      if (path.endsWith("/piegade")) return true;
      if (path.includes("/informacija") && h.includes("piegade")) return true;
      return false;
    }
    if (sec === "buj") {
      if (path.includes("/informacija") && h.includes("buj")) return true;
      return false;
    }
    return false;
  }

  if (st === "checkoutFormFilled") {
    if (!pathname.toLowerCase().includes("/noformesana")) return false;
    return checkoutFormMatchesTask(task);
  }

  return false;
}

export function cheapestPriceInCategory(categoryId) {
  const rows = PRODUCTS.filter((p) => p.categoryId === categoryId);
  if (!rows.length) return null;
  return Math.min(...rows.map((p) => p.price));
}
