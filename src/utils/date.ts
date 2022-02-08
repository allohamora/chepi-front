import { Lang } from 'src/services/pizza/types';

export const dateToTimestamp = (date: Date) => {
  return Math.round(date.getTime() / 1000);
};

export const timestampToDate = (timestamp: number) => {
  return new Date(Math.round(timestamp * 1000));
};

export const getLongDateString = (date: Date, locale: Lang) => {
  return Intl.DateTimeFormat(locale).format(date);
};
