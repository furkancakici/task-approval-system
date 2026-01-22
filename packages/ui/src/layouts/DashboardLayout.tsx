import React from 'react';
import { AppShell, Burger, Group, Text, ScrollArea, NavLink, Avatar, Menu, UnstyledButton, rem } from '@repo/mantine';
import { useTranslation } from 'react-i18next';
import { useDisclosure } from '@repo/mantine';
import { IconLogout, IconChevronDown } from '@repo/mantine';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle';
import { LanguagePicker } from '../components/LanguagePicker';
import { motion, AnimatePresence } from '@repo/shared';


export interface NavLinkItem {
  label: string;
  icon: React.ElementType;
  link?: string;
  onClick?: () => void;
  active?: boolean;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  navLinks: NavLinkItem[];
  logo: React.ReactNode;
  user: {
    name: string;
    email: string;
    image?: string;
  } | null;
  onLogout: () => void;
  currentLanguage?: string;
  onLanguageChange?: (lang: string) => void;
}

export function DashboardLayout({
  children,
  navLinks,
  logo,
  user,
  onLogout,
  currentLanguage,
  onLanguageChange
}: DashboardLayoutProps) {
  const { t } = useTranslation();
  const [opened, { toggle, close }] = useDisclosure();

  const items = navLinks.map((item) => (
    <NavLink
      key={item.label}
      label={item.label}
      leftSection={<item.icon size="1rem" stroke={1.5} />}
      active={item.active}
      onClick={() => {
        item.onClick?.();
        close();
      }}
      variant="light"
    />
  ));

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            {logo}
          </Group>

          <Group>
            {currentLanguage && onLanguageChange && (
              <LanguagePicker
                currentLanguage={currentLanguage}
                onLanguageChange={onLanguageChange}
              />
            )}
            <ColorSchemeToggle />

            {user && (
              <Menu shadow="md" width={200} position="bottom-end">
                <Menu.Target>
                  <UnstyledButton>
                    <Group gap={7}>
                      <Avatar src={user.image} alt={user.name} radius="xl" size={30} />
                      <div style={{ flex: 1 }} className="hidden-mobile">
                        <Text size="sm" fw={500}>{user.name}</Text>
                        <Text c="dimmed" size="xs">{user.email}</Text>
                      </div>
                      <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                    </Group>
                  </UnstyledButton>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item
                    color="red"
                    leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
                    onClick={onLogout}
                  >
                    {t('common.logout')}
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <ScrollArea>
          {items}
        </ScrollArea>
      </AppShell.Navbar>

      <AppShell.Main>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </AppShell.Main>
    </AppShell>
  );
}
