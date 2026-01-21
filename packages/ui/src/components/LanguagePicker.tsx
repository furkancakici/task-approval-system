import { ActionIcon, Menu, Group, Image } from '@mantine/core';
import { IconLanguage } from '@tabler/icons-react';
import styles from './styles/language-picker.module.css';

interface LanguagePickerProps {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
}

export function LanguagePicker({ currentLanguage, onLanguageChange }: LanguagePickerProps) {
  return (
    <Menu shadow="md" width={120}>
      <Menu.Target>
        <ActionIcon variant="outline" size="lg">
          {currentLanguage === 'tr' ? (
            <span style={{ fontSize: '20px' }}>🇹🇷</span>
          ) : (
            <span style={{ fontSize: '20px' }}>🇺🇸</span>
          )}
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item onClick={() => onLanguageChange('tr')} className={styles["language-picker"]}>
          <span style={{ fontSize: '20px' }}>🇹🇷</span> 
          <span>Türkçe</span>
        </Menu.Item>
        <Menu.Item onClick={() => onLanguageChange('en')} className={styles["language-picker"]}>
          <span style={{ fontSize: '20px' }}>🇺🇸</span> 
          <span>English</span>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
