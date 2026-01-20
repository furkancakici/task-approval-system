import React from 'react';
import { AppShell, Burger, Group, Text, ScrollArea, NavLink, Avatar, Menu, UnstyledButton, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconLogout, IconChevronDown } from '@tabler/icons-react';

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
}

export function DashboardLayout({ children, navLinks, logo, user, onLogout }: DashboardLayoutProps) {
  const [opened, { toggle }] = useDisclosure();

  const items = navLinks.map((item) => (
    <NavLink
      key={item.label}
      label={item.label}
      leftSection={<item.icon size="1rem" stroke={1.5} />}
      active={item.active}
      onClick={item.onClick}
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

          {user && (
            <Menu shadow="md" width={200} position="bottom-end">
              <Menu.Target>
                <UnstyledButton>
                  <Group gap={7}>
                    <Avatar src={user.image} alt={user.name} radius="xl" size={30} />
                    <div style={{ flex: 1 }}>
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
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <ScrollArea className="flex-1">
          {items}
        </ScrollArea>
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
