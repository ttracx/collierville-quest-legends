
import { createRoot } from 'react-dom/client'
import { AppRouter } from './router'
import './index.css'

// Use React Router for proper navigation
createRoot(document.getElementById("root")!).render(<AppRouter />);
