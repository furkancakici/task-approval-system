import React from 'react';
import { Container, Paper, Title, Text, Group } from '@mantine/core';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle';
import { LanguagePicker } from '../components/LanguagePicker';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  currentLanguage?: string;
  onLanguageChange?: (lang: string) => void;
}

export function AuthLayout({ children, title, subtitle, currentLanguage, onLanguageChange }: AuthLayoutProps) {
  return (
    <Container fluid style={{ position: 'relative', minHeight: '100vh' }}>
      <Group justify="flex-end" p="md" style={{ position: 'absolute', top: 0, right: 0, width: '100%', zIndex: 100 }}>
        {currentLanguage && onLanguageChange && (
            <LanguagePicker 
                currentLanguage={currentLanguage} 
                onLanguageChange={onLanguageChange} 
            />
        )}
        <ColorSchemeToggle />
      </Group>

      <Container size={420} pt={100} pb={40}>
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
    </Container>
  );
}
