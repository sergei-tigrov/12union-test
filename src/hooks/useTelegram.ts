import { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';

const tg = WebApp;

export function useTelegram() {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
            tg.ready();
            tg.expand();
            setIsReady(true);
        }
    }, []);

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
        // Проверка, запущены ли мы в Telegram
        isTelegram: typeof window !== 'undefined' && !!(window as any).Telegram?.WebApp?.initData
    };
}
