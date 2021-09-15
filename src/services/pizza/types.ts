export const supportedLangs = ['uk', 'ru', 'en'] as const;
export type Lang = typeof supportedLangs[number];

export const supportedCountries = ['ukraine'] as const;
export type County = typeof supportedCountries[number];

export const supportedCities = ['chernivtsi'] as const;
export type City = typeof supportedCities[number];

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
}

type TranslatedPizzaTitles = `${Lang}_title`;
type TranslatedPizzaDescription = `${Lang}_description`;

export type Pizza = BasePizza &
  {
    [key in TranslatedPizzaTitles | TranslatedPizzaDescription]: string;
  };
