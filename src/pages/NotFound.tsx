import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/design-system.css';

const NotFound = () => {
  return (
    <div className="min-h-screen gradient-bg-hero" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="gradient-card"
        style={{ textAlign: 'center', padding: '3rem', maxWidth: '28rem', width: '100%' }}
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
        >
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            style={{ 
              fontSize: '6rem', 
              fontWeight: '800', 
              background: 'var(--gradient-primary)', 
              backgroundClip: 'text', 
              WebkitBackgroundClip: 'text', 
              color: 'transparent',
              marginBottom: '1rem',
              lineHeight: '1'
            }}
          >
            404
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              color: 'var(--color-text)', 
              marginBottom: '1rem' 
            }}
          >
            Страница не найдена
          </motion.h2>
          
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '80px' }}
            transition={{ delay: 0.9, duration: 0.7 }}
            style={{ 
              height: '3px', 
              background: 'var(--gradient-primary)', 
              margin: '0 auto 1.5rem',
              borderRadius: '3px'
            }}
          />
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            style={{ 
              color: 'var(--color-text-muted)', 
              marginBottom: '2rem', 
              lineHeight: '1.6' 
            }}
          >
            Возможно, вы перешли по неверной ссылке или страница была перемещена.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <Link to="/" className="gradient-button" style={{ textDecoration: 'none', padding: '12px 24px', borderRadius: '12px' }}>
              <motion.span
                whileHover={{ x: -5 }}
                transition={{ duration: 0.2 }}
                style={{ color: 'inherit' }}
              >
                ← Вернуться на главную
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
