export const createSizeText = (size: number | null, cm: string) => {
  return `${size} ${cm}`;
};

export const createTitleText = (title: string, size: number | null, cm: string) => {
  return `${title}${size !== null ? ` ${createSizeText(size, cm)}` : ''}`;
};

export const createPriceText = (price: number | null, uah: string) => {
  return `${price} ${uah}`;
};

export const createWeightText = (weight: number | null, gram: string) => {
  return `${weight} ${gram}`;
};

const PLACEHOLDER = '-';

export const textOrPlaceholder = (value: unknown | null | undefined, text: string) => {
  if (value === null || value === undefined) {
    return PLACEHOLDER;
  }

  return text;
};
