import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useKeyboardShortcuts = (actions = {}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeydown = (e) => {
      // Escape for cancel/close
      if (e.key === 'Escape') {
        if (actions.onEscape) actions.onEscape();
      }

      // Ctrl based shortcuts
      if (e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 'k': // Quick Scan
            e.preventDefault();
            navigate('/scan');
            break;
          case 'h': // Dashboard
            e.preventDefault();
            navigate('/dashboard');
            break;
          case 'e': // Export PDF
            e.preventDefault();
            if (actions.onExportPDF) actions.onExportPDF();
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [navigate, actions]);
};

export default useKeyboardShortcuts;
