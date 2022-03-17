import { Translate } from 'next-translate';
import { Lang, Pizza } from 'src/services/pizza/types';
import { createPriceText, createSizeText, createWeightText } from 'src/utils/pizza';
import { capitalize } from 'src/utils/string';

export const getTableData = (pizzas: Pizza[], language: Lang, tValue: Translate) => {
  return pizzas.map((pizza) => {
    const { image, id, link, price, size, weight } = pizza;

    const title = capitalize(pizza[`${language}_title`]);
    const description = capitalize(pizza[`${language}_description`]);

    return {
      key: id,
      id,
      title,
      description,
      image,
      link,
      priceText: price === null ? '-' : createPriceText(price, tValue('uah')),
      weightText: weight === null ? '-' : createWeightText(weight, tValue('gram')),
      sizeText: size === null ? '-' : createSizeText(size, tValue('cm')),
      price,
      weight,
      size,
    };
  });
};
