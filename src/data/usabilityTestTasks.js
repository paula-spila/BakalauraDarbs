/**
 * Uzdevumu komplekti lietojamības testam (A/B versijas).
 * phase 1 → TaskSet 1, phase 2 → TaskSet 2 (neatkarīgi no A/B secības).
 */

export const TASK_SET_1 = [
  {
    id: "s1-t1",
    taskSet: 1,
    title: "Produkta lapa",
    instruction:
      "Atrodiet preci “Stikla ūdens pudele” un atveriet tās produkta lapu.",
    expectedArea: "shop_search_or_nav → product_pdp",
  },
  {
    id: "s1-t2",
    taskSet: 1,
    title: "Cena",
    instruction: "Noskaidrojiet, cik maksā “Stikla ūdens pudele”.",
    expectedArea: "product_pdp",
  },
  {
    id: "s1-t3",
    taskSet: 1,
    title: "Materiāls",
    instruction: "Atrodiet produkta “Māla krūze” materiālu.",
    expectedArea: "product_pdp_mala_kruze",
  },
  {
    id: "s1-t4",
    taskSet: 1,
    title: "Grozs",
    instruction: "Pievienojiet “Māla krūze” grozam.",
    expectedArea: "pdp_add_to_cart",
  },
  {
    id: "s1-t5",
    taskSet: 1,
    title: "Daudzums grozā",
    instruction: "Grozā mainiet “Māla krūze” daudzumu uz 3.",
    expectedArea: "cart_qty",
  },
  {
    id: "s1-t6",
    taskSet: 1,
    title: "Piegādes laiks",
    instruction: "Atrodiet informāciju par piegādes laiku.",
    expectedArea: "delivery_info_page_or_section",
  },
  {
    id: "s1-t7",
    taskSet: 1,
    title: "Kontakti",
    instruction: "Atrodiet kontaktinformāciju.",
    expectedArea: "contacts_or_info",
  },
  {
    id: "s1-t8",
    taskSet: 1,
    title: "Noformēšana",
    instruction:
      "Noformējiet pasūtījumu līdz apstiprināšanas pogai, izmantojot testa datus.",
    expectedArea: "checkout_submit",
  },
];

export const TASK_SET_2 = [
  {
    id: "s2-t1",
    taskSet: 2,
    title: "Produkta lapa",
    instruction:
      "Atrodiet preci “Keramikas bļoda” un atveriet tās produkta lapu.",
    expectedArea: "shop_search_or_nav → product_pdp",
  },
  {
    id: "s2-t2",
    taskSet: 2,
    title: "Cena",
    instruction: "Noskaidrojiet, cik maksā “Keramikas bļoda”.",
    expectedArea: "product_pdp",
  },
  {
    id: "s2-t3",
    taskSet: 2,
    title: "Specifikācija",
    instruction:
      "Atrodiet produkta “Stikla ūdens pudele” materiālu vai specifikāciju.",
    expectedArea: "product_pdp_stikla",
  },
  {
    id: "s2-t4",
    taskSet: 2,
    title: "Grozs",
    instruction: "Pievienojiet “Bambusa griešanas dēlis” grozam.",
    expectedArea: "pdp_add_to_cart",
  },
  {
    id: "s2-t5",
    taskSet: 2,
    title: "Daudzums grozā",
    instruction: "Grozā mainiet “Bambusa griešanas dēlis” daudzumu uz 2.",
    expectedArea: "cart_qty",
  },
  {
    id: "s2-t6",
    taskSet: 2,
    title: "Piegādes izmaksas",
    instruction:
      "Atrodiet informāciju par piegādes izmaksām vai bezmaksas piegādes slieksni.",
    expectedArea: "delivery_cost_info",
  },
  {
    id: "s2-t7",
    taskSet: 2,
    title: "BUJ",
    instruction: "Atrodiet BUJ sadaļu.",
    expectedArea: "info_buj",
  },
  {
    id: "s2-t8",
    taskSet: 2,
    title: "Noformēšana",
    instruction:
      "Noformējiet pasūtījumu līdz apstiprināšanas pogai, izmantojot testa datus.",
    expectedArea: "checkout_submit",
  },
];

/** Fāze 1 → komplekts 1, fāze 2 → komplekts 2 */
export function getTaskSetNumberForPhase(phase) {
  return phase === 1 ? 1 : 2;
}

export function getTasksForPhase(phase) {
  return phase === 1 ? TASK_SET_1 : TASK_SET_2;
}
