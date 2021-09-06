import { FC } from 'react';
import { ThemeProvider } from './ThemeProvider';

export const AppProviders: FC = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;
