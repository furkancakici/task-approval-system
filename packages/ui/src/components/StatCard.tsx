import React from 'react';
import { Paper, Text, Group, ThemeIcon } from '@mantine/core';

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}

export function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  return (
    <Paper withBorder p="md" radius="md">
      <Group justify="space-between">
        <div>
          <Text c="dimmed" tt="uppercase" fw={700} fz="xs">
            {label}
          </Text>
          <Text fw={700} fz="xl">
            {value}
          </Text>
        </div>
        <ThemeIcon color={color} variant="light" size={38} radius="md">
          <Icon style={{ width: '1.5rem', height: '1.5rem' }} stroke={1.5} />
        </ThemeIcon>
      </Group>
    </Paper>
  );
}
