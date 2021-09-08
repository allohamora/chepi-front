const colors = {
  primary: 'var(--ant-primary-6)',
  white: '#ffffff',
} as const;
export type Color = keyof typeof colors;

const media = {
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
} as const;
export type Media = keyof typeof media;

export const theme = {
  colors,
  media,
} as const;
export type Theme = typeof theme;
