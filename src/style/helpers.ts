import { Color, Media, Theme } from './theme';

interface Props {
  theme: Theme;
}

export const media = {
  up: (key: Media) => (p: Props) => `@media (min-width: ${p.theme.media[key]})`,
  down: (key: Media) => (p: Props) => `@media (max-width: ${p.theme.media[key]})`,
};

export const color = (key: Color) => (p: Props) => p.theme.colors[key];
