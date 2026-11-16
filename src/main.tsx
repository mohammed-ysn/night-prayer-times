import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import './index.css';
import { TooltipProvider } from '@/components/ui/tooltip';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<TooltipProvider delayDuration={300} skipDelayDuration={400}>
			<App />
		</TooltipProvider>
	</StrictMode>
);

if ('serviceWorker' in navigator && import.meta.env.PROD) {
	navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`);
}
