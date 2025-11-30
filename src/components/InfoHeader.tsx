import React from 'react';
import { motion } from 'framer-motion';

interface InfoHeaderProps {
  currentBlock: 'A' | 'B' | 'C';
  setShowInfo: (show: boolean) => void;
}

const InfoHeader: React.FC<InfoHeaderProps> = ({ currentBlock, setShowInfo }) => {
  let title = '';
  let description = '';
  
  switch (currentBlock) {
    case 'A':
      title = 'Блок A: Личный потенциал';
      description = 'Вопросы этого блока помогут определить ваш личный потенциал в отношениях. Выберите ответ, который наиболее точно отражает ваше мнение о себе.';
      break;
    case 'B':
      title = 'Блок B: Потенциал отношений';
      description = 'Вопросы этого блока помогут определить потенциал ваших отношений. Выберите ответ, который наиболее точно отражает текущую ситуацию.';
      break;
    case 'C':
      title = 'Блок C: Шкала ценностей';
      description = 'В этом блоке вам предстоит оценить важные аспекты отношений. Передвигайте ползунок в соответствии с вашим отношением к каждому утверждению.';
      break;
  }
  
  return (
    <motion.div 
      className="info-header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="info-content">
        <h2 className="info-title">{title}</h2>
        <p className="info-description">{description}</p>
      </div>
      <motion.button 
        className="close-info-button"
        onClick={() => setShowInfo(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <i className="fas fa-times"></i>
      </motion.button>
    </motion.div>
  );
};

export default InfoHeader;
