import { ActionIcon, useMantineColorScheme, useComputedColorScheme, IconSun, IconMoon } from '@repo/mantine';

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  return (
    <ActionIcon
      onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
      variant="default"
      size="lg"
      aria-label="Toggle color scheme"
    >
      {computedColorScheme === 'light' ? (
        <IconMoon stroke={1.5} size={20} />
      ) : (
        <IconSun stroke={1.5} size={20} />
      )}
    </ActionIcon>
  );
}
