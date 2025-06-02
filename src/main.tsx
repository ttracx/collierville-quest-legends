
import { createRoot } from 'react-dom/client'
import Index from './pages/Index.tsx'
import GenerateAvatars from './pages/GenerateAvatars.tsx'
import './index.css'

// Temporary: Check URL parameter to show avatar generator
const urlParams = new URLSearchParams(window.location.search);
const showAvatars = urlParams.get('avatars') === 'true';

createRoot(document.getElementById("root")!).render(
  showAvatars ? <GenerateAvatars /> : <Index />
);
