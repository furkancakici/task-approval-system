import { Paper, Text, Group, ThemeIcon } from '@repo/mantine';
import { motion } from '@repo/shared';

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}

export function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, translateY: -5 }}
      transition={{ duration: 0.3 }}
      style={{ height: '100%' }}
    >
      <Paper withBorder p="md" radius="md" h="100%">
        <Group justify="space-between" h="100%">
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
    </motion.div>
  );
}
