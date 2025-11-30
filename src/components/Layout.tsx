import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import '../styles/design-system.css';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const [scrolled, setScrolled] = useState(false);
  
  // Отслеживаем скролл страницы для анимации шапки
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <div className="layout-container">
      {/* Modern header component */}
      <Header />
      
      {/* Main content */}
      <main className="layout-main">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>
      
      {/* Footer removed as requested */}
    </div>
  );
};

export default Layout;
