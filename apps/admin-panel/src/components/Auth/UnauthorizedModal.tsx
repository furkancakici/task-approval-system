import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, Center, Text, Anchor, Box, IconAlertCircle } from '@repo/mantine';

interface UnauthorizedModalProps {
    onTimeout: () => void;
}

export function UnauthorizedModal({ onTimeout }: UnauthorizedModalProps) {
    const [seconds, setSeconds] = useState(3);
    const { t } = useTranslation();

    useEffect(() => {
        const timer = setInterval(() => {
            setSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onTimeout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [onTimeout]);

    return (
        <Stack align="center" gap="md" py="md">
            <Center>
                <IconAlertCircle size={40} color="var(--mantine-color-red-6)" />
                <Text fw={700} size="lg">{t('auth.unauthorizedAdminAccessTitle')}</Text>
            </Center>
            <Text ta="center">
                {t('auth.unauthorizedAdminAccessMessage')}
            </Text>

            <Anchor href="http://localhost:3000" size="sm" fw={500}>
                {t('auth.redirectToUserPanel')}
            </Anchor>

            <Box mt="md">
                <Text size="xs" c="dimmed">
                    {t('auth.loggingOutIn', { seconds })}
                </Text>
            </Box>
        </Stack>
    );
}
