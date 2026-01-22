import React from 'react';
import { MantineProvider, ModalsProvider, Notifications, type MantineThemeOverride } from '@repo/mantine';
import { theme as defaultTheme } from './theme';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

interface UiProviderProps {
  children: React.ReactNode;
  theme?: MantineThemeOverride;
}

export function UiProvider({ children, theme }: UiProviderProps) {
  return (
    <MantineProvider theme={theme || defaultTheme} defaultColorScheme="dark">
      <ModalsProvider>
        <Notifications />
        {children}
      </ModalsProvider>
    </MantineProvider>
  );
}
