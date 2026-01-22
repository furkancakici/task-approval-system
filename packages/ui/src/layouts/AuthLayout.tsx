import { Box, Container, Paper, Title, Text, Group, Stack } from '@repo/mantine';
import { motion } from '@repo/shared';
import { useTranslation } from 'react-i18next';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle';
import { LanguagePicker } from '../components/LanguagePicker';
import loginBg from '../assets/login-bg.png';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  currentLanguage?: string;
  onLanguageChange?: (lang: string) => void;
}

export function AuthLayout({ children, title, subtitle, currentLanguage, onLanguageChange }: AuthLayoutProps) {
  const { t } = useTranslation();

  return (
    <Box style={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Settings (Top Right) */}
      <Group justify="flex-end" p="md" style={{ position: 'absolute', top: 0, right: 0, width: '100%', zIndex: 100 }}>
        {currentLanguage && onLanguageChange && (
          <LanguagePicker currentLanguage={currentLanguage} onLanguageChange={onLanguageChange} />
        )}
        <ColorSchemeToggle />
      </Group>

      {/* Left side: Image/Abstract */}
      <Box
        visibleFrom="xs"
        style={{
          flex: 1,
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${loginBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem',
        }}
      >
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <Stack gap="xs">
            <Title c="white" size="3.5rem" fw={900} lts="-0.02em" style={{ lineHeight: 1 }}>
              {t('auth.loginSideTitle')}
            </Title>
            <Text c="white" size="xl" fw={500} opacity={0.8}>
              {t('auth.loginSideSubtitle')}
            </Text>
          </Stack>
        </motion.div>
      </Box>

      {/* Right side: Form */}
      <Box
        style={{
          width: '100%',
          maxWidth: '500px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'var(--mantine-spacing-xl)',
          backgroundColor: 'var(--mantine-color-body)',
        }}
        flex={{ base: 1, md: 'unset' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Container size={400} p={0}>
            <Title order={2} fw={800} size="h1" mb={5}>
              {title}
            </Title>
            {subtitle && (
              <Text c="dimmed" size="md" mb={30}>
                {subtitle}
              </Text>
            )}

            {children}
          </Container>
        </motion.div>
      </Box>
    </Box>
  );
}
