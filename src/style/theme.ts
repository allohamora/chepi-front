const colors = {
  primary: 'var(--ant-primary-6)',
  success: 'var(--ant-success-color)',
  white: '#ffffff',
  black: 'rgba(0, 0, 0, .85)',
  semiBlack: 'rgba(0, 0, 0, .45)',
  bold: '#2c3e50',
} as const;
export type Color = keyof typeof colors;

const media = {
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
} as const;
export type Media = keyof typeof media;

const fontWeight = {
  regular: 400,
  bold: 700,
} as const;
export type FontWeight = keyof typeof fontWeight;

const fontSize = {
  16: '16px',
  20: '20px',
  14: '14px',
};
export type FontSize = keyof typeof fontSize;

export const theme = {
  colors,
  media,
  fontWeight,
  fontSize,
} as const;
export type Theme = typeof theme;
