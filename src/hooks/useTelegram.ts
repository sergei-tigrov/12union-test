import { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';

const tg = WebApp;

export function useTelegram() {
    const [isReady, setIsReady] = useState(false);

    // Проверка, запущены ли мы в Telegram
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isTelegram = typeof window !== 'undefined' && !!(window as any).Telegram?.WebApp?.initData;

    // Инициализация при старте
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
            tg.ready();
            setIsReady(true);
        }
    }, []);

    // Эффект для расширения и установки класса
    useEffect(() => {
        if (isReady) {
            tg.expand();
        }

        // Добавляем класс для компактного режима в Telegram
        if (isTelegram) {
            document.body.classList.add('telegram-webapp-mode');
        } else {
            document.body.classList.remove('telegram-webapp-mode');
        }
    }, [isReady, isTelegram]);

    const onClose = () => {
        tg.close();
    };

    const onToggleButton = () => {
        if (tg.MainButton.isVisible) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    };

    return {
        onClose,
        onToggleButton,
        tg,
        user: tg.initDataUnsafe?.user,
        queryId: tg.initDataUnsafe?.query_id,
        isReady,
        isTelegram
    };
}
