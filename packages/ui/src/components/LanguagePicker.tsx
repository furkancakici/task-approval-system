import { ActionIcon, Menu, Group, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

interface LanguagePickerProps {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
}

export function LanguagePicker({ currentLanguage, onLanguageChange }: LanguagePickerProps) {
  const { t } = useTranslation();
  return (
    <Menu shadow="md" width={120}>
      <Menu.Target>
        <ActionIcon variant="outline" size="lg">
          {currentLanguage === 'tr' ? (
            <Text>🇹🇷</Text>
          ) : (
            <Text>🇺🇸</Text>
          )}
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item onClick={() => onLanguageChange('tr')}>
          <Group gap={5}>
            <Text>🇹🇷</Text> 
            <Text>{t('common.tr')}</Text>
          </Group>
        </Menu.Item>
        <Menu.Item onClick={() => onLanguageChange('en')}>
          <Group gap={5}>
            <Text>🇺🇸</Text> 
            <Text>{t('common.en')}</Text>
          </Group>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
