import React from 'react';
import { Container, Paper, Title, Text, Center } from '@mantine/core';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: 'var(--mantine-color-gray-0)' 
    }}>
      <Container size={420} my={40}>
        <Title ta="center" className="font-bold text-2xl">
          {title}
        </Title>
        {subtitle && (
          <Text c="dimmed" size="sm" ta="center" mt={5}>
            {subtitle}
          </Text>
        )}

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          {children}
        </Paper>
      </Container>
    </div>
  );
}
