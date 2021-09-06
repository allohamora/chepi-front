import { FC } from 'react';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { theme } from 'src/style/theme';

export const ThemeProvider: FC = ({ children }) => (
  <EmotionThemeProvider theme={theme}>{children}</EmotionThemeProvider>
);
