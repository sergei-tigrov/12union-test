import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Import components
import { Home, NotFound } from './pages';
import { SmartAdaptiveTestPage } from './pages/SmartAdaptiveTestPage';
import { Layout } from './components';

function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
                      <Route path="/adaptive-test" element={<Layout><SmartAdaptiveTestPage /></Layout>} />
            <Route path="/smart-adaptive-test" element={<Layout><SmartAdaptiveTestPage /></Layout>} />
            <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App
