import { Theme as AppTheme } from 'src/style/theme';
import '@emotion/react';

declare module '@emotion/react' {
  export interface Theme extends AppTheme {}
}
