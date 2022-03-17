import { Pizza } from 'src/services/pizza/types';

export const pizza: Pizza = {
  id: '1',
  lang: 'uk',
  country: 'ukraine',
  city: 'chernivtsi',
  image: '/images/logo.svg',
  link: '/',
  price: 129,
  size: 30,
  weight: 1000,
  uk_title: 'Смачна',
  uk_description: 'Сир, помідори',
  ru_title: 'Вкусная',
  ru_description: 'Сыр, помидоры',
  en_title: 'Delicious',
  en_description: 'Cheese, tomatoes',
};

export const pizzaWithHistory: Pizza = {
  ...pizza,
  historyOfChanges: [
    {
      key: 'price',
      new: 129,
      old: 110,
      detectedAt: new Date().getTime() / 1000,
    },
    {
      key: 'weight',
      new: 1000,
      old: 1100,
      detectedAt: new Date().getTime() / 1000,
    },
    {
      key: 'uk_title',
      new: 'Смачна',
      old: 'Дуже смачна',
      detectedAt: new Date().getTime() / 1000,
    },
    {
      key: 'uk_description',
      new: 'Сир, помідори',
      old: 'Сир',
      detectedAt: new Date().getTime() / 1000,
    },
    {
      key: 'ru_title',
      new: 'Вкусная',
      old: 'Очень вкусная',
      detectedAt: new Date().getTime() / 1000,
    },
    {
      key: 'ru_description',
      new: 'Сыр, помидоры',
      old: 'Сыр',
      detectedAt: new Date().getTime() / 1000,
    },
    {
      key: 'en_title',
      new: 'Delicious',
      old: 'Very Delicious',
      detectedAt: new Date().getTime() / 1000,
    },
    {
      key: 'en_description',
      new: 'Cheese, tomatoes',
      old: 'Cheese',
      detectedAt: new Date().getTime() / 1000,
    },
  ],
};
