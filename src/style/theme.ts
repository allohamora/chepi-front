const colors = {
  primary: 'var(--ant-primary-6)',
  success: 'var(--ant-success-color)',
  danger: 'var(--ant-error-color)',
  white: '#ffffff',
  black: 'rgba(0, 0, 0, .85)',
  semiBlack: 'rgba(0, 0, 0, .45)',
  gray: '#d9d9d9',
  weakGray: 'rgba(0, 0, 0, .014)',
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
  14: '14px',
  16: '16px',
  18: '18px',
  20: '20px',
  24: '24px',
};
export type FontSize = keyof typeof fontSize;

export const theme = {
  colors,
  media,
  fontWeight,
  fontSize,
} as const;
export type Theme = typeof theme;
