import React from 'react';
import { MantineProvider, ModalsProvider, Notifications } from '@repo/mantine';
import { theme } from './theme';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

interface UiProviderProps {
  children: React.ReactNode;
}

export function UiProvider({ children }: UiProviderProps) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <ModalsProvider>
        <Notifications />
        {children}
      </ModalsProvider>
    </MantineProvider>
  );
}
