import catalog from "./products.json";

export const PRODUCT_CATEGORIES = catalog.categories;
export const PRODUCTS = catalog.products;

export function getProductById(id) {
  const n = Number(id);
  return PRODUCTS.find((p) => p.id === n) ?? null;
}

export function categoryLabel(categoryId) {
  const c = PRODUCT_CATEGORIES.find((x) => x.id === categoryId);
  return c ? c.label : categoryId;
}
