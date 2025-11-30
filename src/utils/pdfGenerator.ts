import { toJpeg } from 'html-to-image';

/**
 * Экспорт ВСЕЙ страницы в PDF как она есть в момент нажатия
 */
export const generatePDF = async (): Promise<void> => {
  // Индикатор загрузки  
  const loading = document.createElement('div');
  loading.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(255,255,255,0.9); display: flex; align-items: center;
    justify-content: center; z-index: 10000; font-family: sans-serif;
  `;
  loading.innerHTML = '<div style="padding: 20px; background: white; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">📸 Создаем PDF...</div>';
  
  // Массив для восстановления состояния кнопок
  const hiddenButtons: HTMLElement[] = [];
  
  try {
    document.body.appendChild(loading);
    
    // Находим главный элемент
    const element = document.querySelector('[data-testid="results-page"]') as HTMLElement;
    if (!element) {
      throw new Error('Элемент страницы не найден');
    }
    
    console.log('📸 Экспортируем страницу в текущем состоянии...');
    
    // === СКРЫВАЕМ ТОЛЬКО КНОПКИ ===
    const buttons = element.querySelectorAll('button, .action-buttons, .pdf-button');
    buttons.forEach(btn => {
      if (btn instanceof HTMLElement) {
        btn.style.display = 'none';
        hiddenButtons.push(btn);
      }
    });
    
    // Небольшая пауза для применения стилей
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // === СОЗДАНИЕ PDF ===
    console.log('📸 Создаем снимок...');
    
    const imageBlob = await toJpeg(element, {
      quality: 0.85,  // Для JPEG качество 85% - хороший баланс размера и качества
      pixelRatio: 1.5,
      backgroundColor: '#ffffff',
      cacheBust: true,
      skipFonts: true,  // Пропускаем проблемные шрифты
      skipAutoScale: true,
      preferredFontFormat: 'woff2',
      style: {
        overflow: 'visible',
        height: 'auto'
      }
    });
    
    const img = new Image();
    img.src = imageBlob;
    await new Promise(resolve => {
      img.onload = resolve;
    });
    
    const { jsPDF } = await import('jspdf');
    
    const imgWidth = img.width;
    const imgHeight = img.height;
    const pdfWidth = Math.max(imgWidth / 3.78, 210);
    const pdfHeight = imgHeight / 3.78;
    
    const pdf = new jsPDF({
      orientation: pdfHeight > pdfWidth ? 'portrait' : 'landscape',
      unit: 'mm',
      format: [pdfWidth, pdfHeight]
    });
    
    pdf.addImage(imageBlob, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    
    const now = new Date();
    const fileName = `Результаты_${now.getDate()}-${now.getMonth() + 1}_${now.getHours()}-${now.getMinutes()}.pdf`;
    pdf.save(fileName);
    
    console.log('✅ PDF создан!');
    
  } catch (error) {
    console.error('❌ Ошибка:', error);
    alert(`Ошибка создания PDF: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
  } finally {
    // Восстанавливаем кнопки
    hiddenButtons.forEach(btn => {
      btn.style.display = '';
    });
    
    loading.remove();
    console.log('�� Готово');
  }
};
