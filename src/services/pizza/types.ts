export const supportedLangs = ['uk', 'ru', 'en'] as const;
export type Lang = typeof supportedLangs[number];

export const supportedCountries = ['ukraine'] as const;
export type County = typeof supportedCountries[number];

export const supportedCities = ['chernivtsi'] as const;
export type City = typeof supportedCities[number];

type Title = `${Lang}_title`;
type Description = `${Lang}_description`;
type Company = `${Lang}_company`;

export type HistoryOfChangesWatchKey = Title | Description | 'image' | 'price' | 'weight';
export type HistoryOfChangesValue = string | number | undefined | null;

export interface Change {
  key: HistoryOfChangesWatchKey;
  old?: HistoryOfChangesValue;
  new?: HistoryOfChangesValue;
  detectedAt: number;
}

interface BasePizza {
  id: string;
  link: string; // http://pizza.com/buy-pizza/:id
  image: string; // http://pizza.com/image
  lang: Lang;
  size: number | null; // 30cm
  price: number | null; // 135grn
  weight: number | null; // 400g
  country: County;
  city: City;
  historyOfChanges?: Change[];
}

export type Pizza = BasePizza & {
  [key in Title | Description]: string;
} & {
  [key in Company]: string;
};
