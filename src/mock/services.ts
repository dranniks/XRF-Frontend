import type { Service } from "../types/domain";

export const mockServices: Service[] = [
  {
    slug: "bronze",
    name: "Бронза",
    era: "одний бронзовый век",
    culture: "эгейское Средиземноморье",
    description: "Эталонный бронзовый сплав для базового сопоставления.",
    imageUrl: "",
    cuReference: "0.83",
    znReference: "0.04",
    snReference: "0.31",
    pbReference: "0.12",
    price: 0,
    availableDate: ""
  },
  {
    slug: "bronze-cyprus",
    name: "Бронза Кипра",
    era: "поздний бронзовый век",
    culture: "восточное Средиземноморье",
    description: "Эталон бронзы Кипра.",
    imageUrl: "",
    cuReference: "0.83",
    znReference: "0.04",
    snReference: "0.31",
    pbReference: "0.12",
    price: 0,
    availableDate: ""
  },
  {
    slug: "silver-byzantium",
    name: "Серебро Византии",
    era: "раннее средневековье",
    culture: "Византия",
    description: "Серебряный эталон византийского периода.",
    imageUrl: "",
    cuReference: "0.79",
    znReference: "0.19",
    snReference: "0.01",
    pbReference: "0.02",
    price: 0,
    availableDate: ""
  },
  {
    slug: "brass-rome",
    name: "Латунь Рима",
    era: "античность",
    culture: "древний Рим",
    description: "Латунный эталон римского периода.",
    imageUrl: "",
    cuReference: "0.78",
    znReference: "0.64",
    snReference: "0.06",
    pbReference: "0.03",
    price: 0,
    availableDate: ""
  }
];

export const servicesBySlug = new Map(mockServices.map((service) => [service.slug, service]));
