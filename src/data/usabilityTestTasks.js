import { cheapestPriceInCategory } from "../lib/usabilityTaskSuccess.js";

/** @param {number} price */
export function buildPriceAcceptedList(price) {
  if (price == null || !Number.isFinite(Number(price))) return [];

  const n = Number(price);
  const sDot = n.toFixed(2);
  const sComma = sDot.replace(".", ",");
  const intPart = String(Math.floor(n + 1e-9));
  const fracNum = Math.round((n * 100) % 100);
  const hasFrac = fracNum !== 0;
  const shortDot = hasFrac ? `${intPart}.${String(fracNum).padStart(2, "0")}` : intPart;
  const shortComma = hasFrac ? `${intPart},${String(fracNum).padStart(2, "0")}` : intPart;

  return Array.from(
    new Set([
      intPart,
      sDot,
      sComma,
      shortDot,
      shortComma,
      `${intPart}€`,
      `${sDot}€`,
      `${sComma} €`,
      `${sDot} €`,
      `${intPart},00`,
      `${intPart}.00`,
    ]),
  );
}

const MAJA_CAT = "maja-un-uzglabasana";
const VIRTUVE_CAT = "virtuve-un-galds";

const cheapestMaja = cheapestPriceInCategory(MAJA_CAT);
const cheapestVirtuve = cheapestPriceInCategory(VIRTUVE_CAT);

/** @param {{ taskSetOrder?: string, currentPhase?: number }} session */
export function getTaskSetNumberForPhase(session, phase) {
  const p = phase ?? session?.currentPhase ?? 1;
  const order = session?.taskSetOrder === "21" ? "21" : "12";

  if (p === 1) return order === "12" ? 1 : 2;

  return order === "12" ? 2 : 1;
}

/**
 * @param {{ taskSetOrder?: string, currentPhase?: number }} session
 */
export function getTasksForPhase(session) {
  const set = getTaskSetNumberForPhase(session, session?.currentPhase ?? 1);
  return set === 1 ? TASK_SET_1 : TASK_SET_2;
}

export function getTaskCount() {
  return TASK_SET_1.length;
}

export const TASK_SET_1 = [
  {
    id: "s1-t1",
    title: "Kategorijas produkts",
    instruction:
      "Atrodiet jebkuru produktu kategorijā “Virtuve un galds” un atveriet tā produkta lapu.",
    successType: "categoryProduct",
    targetCategoryId: VIRTUVE_CAT,
    targetCategoryName: "Virtuve un galds",
  },
  {
    id: "s1-t2",
    title: "Preču kārtošana",
    instruction:
      "Veikalā sakārtojiet preces alfabētiskā secībā no A līdz Z.",
    successType: "sortApplied",
    targetSort: "name-asc",
  },
  {
    id: "s1-t3",
    title: "Saziņas sadaļa",
    instruction: "Atrodiet kontaktinformācijas sadaļu.",
    successType: "infoSection",
    targetSection: "kontakti",
  },
  {
    id: "s1-t4",
    title: "Materiāls",
    instruction:
      "Atveriet produkta “USB atmiņa 32 GB” detalizēto lapu un ievadiet, no kāda materiāla tā ir izgatavota.",
    successType: "answerInput",
    targetProductId: 59,
    acceptedAnswers: [
      "metāls, plastmasa",
      "metals, plastmasa",
      "metāls plastmasa",
      "metals plastmasa",
      "metāls",
      "metals",
      "plastmasa",
      "plastic",
    ],
  },
  {
    id: "s1-t5",
    title: "Piegādes nosacījumi",
    instruction: "Atrodiet bezmaksas piegādes slieksni un ievadiet summu.",
    successType: "answerInput",
    acceptedAnswers: buildPriceAcceptedList(35),
  },
  {
    id: "s1-t6",
    title: "Grozs",
    instruction:
      "Pievienojiet produktu “Vaska svece” grozam.",
    successType: "cartContainsAndOpened",
    targetProductId: 8,
    minQuantity: 1,
  },
  {
    id: "s1-t7",
    title: "Daudzums grozā",
    instruction: "Grozā nomainiet iepriekš pievienotā produkta daudzumu uz “5”.",
    successType: "cartQuantity",
    targetProductId: 8,
    targetQuantity: 5,
  },
  {
    id: "s1-t8",
    title: "Kontaktadrese",
    instruction:
      "Atrodiet kontaktu / saziņas sadaļā norādīto ielu un mājas numuru un ievadiet to.",
    successType: "answerInput",
    targetSection: "kontakti",
    acceptedAnswers: [
      "brīvības iela 123",
      "brivibas iela 123",
      "brīvības 123",
      "brīvība 123",
      "brivibas 123",
    ],
  },
  {
    id: "s1-t9",
    title: "Lētākais produkts",
    instruction:
      "Atrodiet lētāko produktu kategorijā “Māja un uzglabāšana” un ievadiet tā cenu.",
    successType: "answerInput",
    targetCategoryName: "Māja un uzglabāšana",
    acceptedAnswers: buildPriceAcceptedList(cheapestMaja ?? 0),
  },
  {
    id: "s1-t10",
    title: "Pasūtījuma forma",
    instruction:
      "Noformējiet pasūtījumu, ievades lauki jau ir aizpildīti.",
    successType: "checkoutFormFilled",
    checkoutTestData: {
      name: "Testa Lietotājs",
      email: "tests@example.com",
      street: "Testa iela 1",
      city: "Rīga",
      postalCode: "LV-1001",
      phone: "20000000",
    },
  },
];

export const TASK_SET_2 = [
  {
    id: "s2-t1",
    title: "Kategorijas produkts",
    instruction:
      "Atrodiet jebkuru produktu kategorijā “Kanceleja un somas” un atveriet tā produkta lapu.",
    successType: "categoryProduct",
    targetCategoryId: "kanceleja-un-somas",
    targetCategoryName: "Kanceleja un somas",
  },
  {
    id: "s2-t2",
    title: "Preču kārtošana",
    instruction:
      "Veikalā sakārtojiet preces alfabētiskā secībā no Z līdz A.",
    successType: "sortApplied",
    targetSort: "name-desc",
  },
  {
    id: "s2-t3",
    title: "BUJ",
    instruction: "Atrodiet „BUJ“ sadaļu.",
    successType: "infoSection",
    targetSection: "buj",
  },
  {
    id: "s2-t4",
    title: "Materiāls",
    instruction:
      "Atveriet produkta “Marķieri” detalizēto lapu un ievadiet, no kāda materiāla tie ir izgatavoti.",
    successType: "answerInput",
    targetProductId: 36,
    acceptedAnswers: [
      "plastmasa, tinte",
      "plastmasa tinte",
      "plastmasa",
      "tinte",
      "plastic, ink",
      "plastic",
      "ink",
    ],
  },
  {
    id: "s2-t5",
    title: "Piegādes nosacījumi",
    instruction: "Atrodiet standarta piegādes maksu un ievadiet summu.",
    successType: "answerInput",
    acceptedAnswers: buildPriceAcceptedList(3.5),
  },
  {
    id: "s2-t6",
    title: "Grozs",
    instruction:
      "Pievienojiet produktu “Griešanas dēlis” grozam.",
    successType: "cartContainsAndOpened",
    targetProductId: 3,
    minQuantity: 1,
  },
  {
    id: "s2-t7",
    title: "Daudzums grozā",
    instruction: "Grozā nomainiet iepriekš pievienotā produkta daudzumu uz “3”.",
    successType: "cartQuantity",
    targetProductId: 3,
    targetQuantity: 3,
  },
  {
    id: "s2-t8",
    title: "Kontaktadrese",
    instruction:
      "Atrodiet kontaktu / saziņas sadaļā norādīto pilsētu un pasta indeksu un ievadiet tos.",
    successType: "answerInput",
    targetSection: "kontakti",
    acceptedAnswers: [
      "rīga lv-1010",
      "riga lv-1010",
      "rīga, lv-1010",
      "riga, lv-1010",
      "rīga lv1010",
      "riga lv1010",
    ],
  },
  {
    id: "s2-t9",
    title: "Lētākais produkts",
    instruction:
      "Atrodiet lētāko produktu kategorijā “Virtuve un galds” un ievadiet tā cenu.",
    successType: "answerInput",
    targetCategoryName: "Virtuve un galds",
    acceptedAnswers: buildPriceAcceptedList(cheapestVirtuve ?? 0),
  },
  {
    id: "s2-t10",
    title: "Pasūtījuma forma",
    instruction:
      "Noformējiet pasūtījumu, ievades lauki jau ir aizpildīti.",
    successType: "checkoutFormFilled",
    checkoutTestData: {
      name: "Test",
      email: "demo@example.com",
      street: "Parauga iela 5",
      city: "Jelgava",
      postalCode: "LV-3001",
      phone: "21111111",
    },
  },
];

/** @deprecated use getTasksForPhase(session) */
export const USABILITY_TASK_LIST = TASK_SET_1;
