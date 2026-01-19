import React from 'react';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { theme } from './theme';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

interface UiProviderProps {
  children: React.ReactNode;
}

export function UiProvider({ children }: UiProviderProps) {
  return (
    <MantineProvider theme={theme}>
      <Notifications />
      {children}
    </MantineProvider>
  );
}
