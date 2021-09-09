export const supportedCountries = {
  ukraine: {
    cities: ['chernivtsi'],
  },
};

export type SupportedCountriesKey = keyof typeof supportedCountries;

export const supportedCountriesVariants = Object.keys(supportedCountries).reduce<{ city: string; country: string }[]>(
  (state, key) => {
    const { cities } = supportedCountries[key as SupportedCountriesKey];
    state.push(...cities.map((city) => ({ country: key, city })));

    return state;
  },
  [],
);
