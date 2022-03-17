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
